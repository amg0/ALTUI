-- // Plugin ALTUI
-- // This program is free software: you can redistribute it and/or modify
-- // it under the condition that it is for private or home useage and
-- // this whole comment is reproduced in the source code file.
-- // Commercial utilisation is not authorized without the appropriate
-- // written agreement from amg0 / alexis . mermet @ gmail . com
-- // This program is distributed in the hope that it will be useful,
-- // but WITHOUT ANY WARRANTY; without even the implied warranty of
-- // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
local MSG_CLASS = "ALTUI"
local ALTUI_SERVICE = "urn:upnp-org:serviceId:altui1"
local devicetype = "urn:schemas-upnp-org:device:altui:1"
local version = "v2.53b"
local SWVERSION = "3.5.1" -- "3.4.1" -- "3.3.1"	-- "2.2.4"
local BOOTSTRAPVERSION = "4.5.3" 
local UI7_JSON_FILE= "D_ALTUI_UI7.json"
local ALTUI_TMP_PREFIX = "altui-"
local ALTUI_SONOS_MP3 = ALTUI_TMP_PREFIX .. "sonos.mp3"
local NMAX_IN_VAR	= 4000
local DEFAULT_TIMEOUT = 30000
local THINGSPEAK_PUSH_SEC = 15	-- thingspeak limits
local this_device = nil
local DEBUG_MODE = false	-- controlled by UPNP action
local WFLOW_MODE = false	-- controlled by UPNP action
local REMOTEACCESS_URL = "https://bpspec.com/altui/Veralogin.php"

local json = require("dkjson")
if (type(json) == "string") then
	luup.log("ALTUI warning dkjson missing, falling back to L_ALTUIjson", 2)
	json = require("L_ALTUIjson")
end
local mime = require("mime")
local socket = require("socket")
local http = require("socket.http")
local https = require ("ssl.https")
local ltn12 = require("ltn12")
local modurl = require "socket.url"

local bUseCompress = false
local compress = require "L_ALTUI_LuaRunHandler"
local lzw = compress.new "LZW2"

local tmpprefix = "/tmp/altui_"		-- prefix for tmp files
local hostname = ""
local port3480 = "/port_3480"		-- should be :3480 on openluup

local DataProviders={}				-- DataProviders database
local DataProvidersCallbacks={}		-- map names to functions in the local context, only for embedded providers registered within this module in LUA
local remoteWatches={}
local registeredWatches = {}
local WorkflowsActiveState = {}		-- hash indexed by workflow altuiid
local WorkflowsVariableBag = {}		-- hash indexed by workflow altuiid
local Workflows = {}				-- Workflow database made from the persistent description
local ForcedValidLinks = {}			-- array of 'id' = true for links which must be considered as true
local WorkflowTriggers = {}			-- array of workflow triggers ( waiting for a workflow to reach a state )

-- local strWorkflowDescription = ""
local strWorkflowTransitionTemplate = "Wkflow - Workflow: %s, Valid Transition found:%s, Active State:%s=>%s"	-- needed for ALTUI grep & history log feature
local Timers = {}					-- to Persist timers across VERA reboots
local TimersDisabled = {} 			-- octo - flag to stop interrupts from clearing timer 
local ReceivedData = {}				-- buffer for receiving split data chunks

--calling a function from HTTP in the device context
--http://192.168.1.5/port_3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&DeviceNum=81&Code=getMapUrl(81)


------------------------------------------------
-- ALTUI --
-- DUplicate code to have it available both in global scene/etc and in workflows
------------------------------------------------
ALTUI = {}
function ALTUI.notify( pushingbox_DID, str )
	local modurl = require "socket.url"
	-- debug(string.format("ALTUI_notify( %s, %s )",pushingbox_DID, str))
	local newstr = modurl.escape( str or "" )
	luup.inet.wget("http://api.pushingbox.com/pushingbox?devid=" .. pushingbox_DID .. "&value=" .. newstr .. "" )
	return true
end
function ALTUI.getWorkflowBagValue( workflowAltuiid, varname )
	-- debug(string.format("getWorkflowBagValue( %s, %s )",workflowAltuiid, varname))
	if (WorkflowsVariableBag[workflowAltuiid] ~= nil) then
		-- debug(string.format("getWorkflowBagValue( %s, %s ) => %s",workflowAltuiid, varname,WorkflowsVariableBag[ workflowAltuiid ] [varname]))
		return WorkflowsVariableBag[ workflowAltuiid ] [varname]
	end
	-- debug(string.format("getWorkflowBagValue( %s, %s ) => nil",workflowAltuiid, varname))
	return nil
end
function  ALTUI.time_is_between(startTime,endTime)
	local hour = tonumber( startTime:sub( startTime:find("%d+") ) )
	local minute = tonumber(startTime:sub(-2))
	if hour and minute then
		startTime = hour * 100 + minute
	else
		luup.log("ERROR: invalid start time")
		return false
	end
	hour = tonumber( endTime:sub( endTime:find("%d+") ) )
	minute = tonumber(endTime:sub(-2))
	if hour and minute then
		endTime = hour * 100 + minute
	else
		luup.log("ERROR: invalid end time")
		return false
	end
	local currentTime = os.date("*t")
	currentTime = currentTime.hour * 100 + currentTime.min
	--luup.log("startTime = " .. startTime .. "; currentTime = " .. currentTime .. "; endTime = " .. endTime)
	if startTime <= endTime then
		-- Both the start time and the end time are in the same day:
		-- if the current time is in the given interval, run the scene.
		if startTime <= currentTime and currentTime <= endTime then
			return true
		end
	else
		-- The start time is before midnight, and the end time is after midnight:
		-- if the current time is not outside the given interval, run the scene.
		if not (endTime < currentTime and currentTime < startTime) then
			return true
		end
	end
	return false
end
------------------------------------------------
-- Debug --
------------------------------------------------
function log(text, level)
	luup.log(string.format("%s: %s", MSG_CLASS, text), (level or 50))
end

function debug(text)
	if (DEBUG_MODE) then
		log("debug: " .. text)
	end
end

function warning(stuff)
	log("warning: " .. stuff, 2)
end

function error(stuff)
	log("error: " .. stuff, 1)
end

-- local function dumpString(str)
	-- for i=1,str:len() do
		-- debug(string.format("i:%d c:%d char:%s",i,str:byte(i),str:sub(i,i) ))
	-- end
-- end

function string.starts(String,Start)
   return string.sub(String,1,string.len(Start))==Start
end

local function isempty(s)
  return s == nil or s == ''
end

local function file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end

---code from lolodomo DNLA plugin
local function xml_decode(val)
	  return val:gsub("&#38;", '&')
				:gsub("&#60;", '<')
				:gsub("&#62;", '>')
				:gsub("&#34;", '"')
				:gsub("&#39;", "'")
				:gsub("&lt;", "<")
				:gsub("&gt;", ">")
				:gsub("&quot;", '"')
				:gsub("&apos;", "'")
				:gsub("&amp;", "&")
end

---code from lolodomo DNLA plugin
local function xml_encode(val)
	  return val:gsub("&", "&amp;")
				:gsub("<", "&lt;")
				:gsub(">", "&gt;")
				:gsub('"', "&quot;")
				:gsub("'", "&apos;")
end

local function findALTUIDevice()
	for k,v in pairs(luup.devices) do
		if( v.device_type == devicetype ) then
			return k
		end
	end
	return -1
end

local function findSONOSDevice()
	local altsonos=-1
	for k,v in pairs(luup.devices) do
		if( v.device_type == "urn:schemas-micasaverde-com:device:Sonos:1" ) then
			return k,1	--sonos
		end
		if ( v.device_type == "urn:schemas-upnp-org:device:altsonos:1") then
			altsonos=k
		end
	end
	return altsonos,2 --altsonos or nothing
end

local function table2params(workflowaltuiid,args)
	local result={}
	for k,arg in pairs(args) do
		local res = string.gsub(arg.value or "","Bag%[\"(.-)\"%]",
			function(w)
				return WorkflowsVariableBag[ workflowaltuiid ][w]
			end
		)
		result[ arg.name ]	= res
		debug(string.format("Wkflow - Action Parameter: %s => %s",arg.value or "",res))
	end
	return result
end

local Queue = {
	new = function(self,o)
		o = o or {}	  -- create object if user does not provide one
		setmetatable(o, self)
		self.__index = self
		return o
	end,
	size = function(self)
		return tablelength(self)
	end,
	push = function(self,e)
		return table.insert(self,1,e)
	end,
	pull = function(self)
	    local elem = self[1]
		table.remove(self,1)
		return elem
	end,
	add = function(self,e)
		return table.insert(self,e)
	end,
	removeItem = function(self, idx)
		table.remove(self,idx)
	end,
	getHead = function(self)
		local elem = self[1]
		return elem
	end,
	list = function(self)
		local i = 0
		return function()
			if (i<#self) then
				i=i+1
				return i,self[i]
			end
		end
	end,
	listReverse = function(self)
		local i = #self
		return function()
			if (i>0) then
				local j = i
				i = i-1
				return j,self[j]
			end
		end
	end,
}

local Thingspeak_Queue = Queue:new()
local IFTTT_Queue = Queue:new()

local function isOpenLuup()
	local openLuup = luup.attr_get("openLuup")
	if (openLuup == '' ) then
		return false
	end
	return true
end

------------------------------------------------
-- Device Properties Utils
------------------------------------------------

local function getSetVariable(serviceId, name, deviceId, default)
	local curValue = luup.variable_get(serviceId, name, deviceId)
	if (curValue == nil) then
		curValue = default
		luup.variable_set(serviceId, name, curValue, deviceId)
	end
	return curValue
end

local function getSetVariableIfEmpty(serviceId, name, deviceId, default)
	local curValue = luup.variable_get(serviceId, name, deviceId)
	if (curValue == nil) or (curValue:trim() == "") then
		curValue = default
		luup.variable_set(serviceId, name, curValue, deviceId)
	end
	return curValue
end

local function setVariableIfChanged(serviceId, name, value, deviceId)
	debug(string.format("setVariableIfChanged(%s,%s,%s,%s)",serviceId, name, value, deviceId))
	local curValue = luup.variable_get(serviceId, name, tonumber(deviceId)) or ""
	value = value or ""
	if (tostring(curValue)~=tostring(value)) then
		luup.variable_set(serviceId, name, value, tonumber(deviceId))
	end
end

local function setAttrIfChanged(name, value, deviceId)
	debug(string.format("setAttrIfChanged(%s,%s,%s)",name, value, deviceId))
	local curValue = luup.attr_get(name, deviceId)
	if ((value ~= curValue) or (curValue == nil)) then
		luup.attr_set(name, value, deviceId)
		return true
	end
	return value
end

local function call_action(service,action,params,device)
	debug(string.format("Calling Action device:%s Service:%s Action:%s Params:%s",device,service,action,json.encode(params)))
	local resultCode, resultString, job, returnArguments =luup.call_action(service,action,params,device)
	return resultCode, resultString, job, returnArguments
end

local function run_scene(id)
	debug(string.format("run_scene(%s)",id or "nil"))
	local resultCode, resultString, job, returnArguments = luup.call_action("urn:micasaverde-com:serviceId:HomeAutomationGateway1", "RunScene", {SceneNum = tostring(id)}, 0)
	return resultCode, resultString, job, returnArguments
end

-- sceneIDs is ',' comma separated list of scene ID to run
local function runScene(lul_device,sceneIDs)
	sceneIDs = sceneIDs or ""
	debug(string.format("runScene(%s)",sceneIDs))
	local parts = sceneIDs:altui_split(",")
	for k,v in pairs(parts) do
		local sceneid = tonumber(v)
		if (sceneid ~=nil) then
			run_scene(sceneid)
		else
			warning(string.format("sceneid %s is not a number, ignoring it",v or ""))
		end
	end
end

local function getDataFor( deviceID,name,prefix )
	local prefix = prefix or "Data_"
	debug(string.format("getDataFor(%s,%s)",name,prefix))
	local name = prefix..name
	name = name:gsub(" ", "+")	-- spaces are replaced by '+'
	local num = 0
	local var = nil
	local result_tbl = {}
	local result = ""

	-- search for all "Data_xxx_nnn" variables and concatenate them
	-- debug("reading "..name.."_"..num)
	var = luup.variable_get(ALTUI_SERVICE, name.."_"..num, deviceID) or ""
	-- debug("var =("..var..")")
	while( var ~= "") do
		num = num+1
		result_tbl[#result_tbl+1] = var
		-- debug("reading "..name.."_"..num)
		var = luup.variable_get(ALTUI_SERVICE, name.."_"..num, deviceID) or ""
		-- debug("var =("..var..")")
	end
	result = table.concat(result_tbl)
	if (result=="") then
		return nil
	end

	if (result:sub(1, 4) == "LZW2") then
		result = lzw.decode(result)
	end
	debug("returning "..result)
	return result
end

local function setDataFor( deviceID,name,prefix,data )
	local npage = 0
	local name = prefix..name
	name = name:gsub(" ", "+")	-- spaces are replaced by '+'
	local length = data:len()

	-- save by chunks
	for start = 1,length,NMAX_IN_VAR  do
		luup.variable_set(ALTUI_SERVICE, name.."_"..npage, data:sub(start,start+NMAX_IN_VAR-1), deviceID)
		npage = npage+1
	end

	-- clear next unused variables chunks
	local var = luup.variable_get(ALTUI_SERVICE, name.."_"..npage,	deviceID)
	while ((var ~= nil) and (var ~="" )) do
		luup.variable_set(ALTUI_SERVICE, name.."_"..npage, "", deviceID)
		npage = npage+1
		var = luup.variable_get(ALTUI_SERVICE, name.."_"..npage,  deviceID)
	end
end

local function setDebugMode(lul_device,newDebugMode)
	lul_device = tonumber(lul_device)
	newDebugMode = tonumber(newDebugMode) or 0
	log(string.format("setDebugMode(%d,%d)",lul_device,newDebugMode))
	luup.variable_set(ALTUI_SERVICE, "Debug", newDebugMode, lul_device)
	if (newDebugMode==1) then
		DEBUG_MODE=true
	else
		DEBUG_MODE=false
	end
	return true	-- success
end

local function getIP()
	-- local stdout = io.popen("GetNetworkState.sh ip_wan")
	-- local ip = stdout:read("*a")
	-- stdout:close()
	-- return ip
	local mySocket = socket.udp ()
	mySocket:setpeername ("42.42.42.42", "424242")	-- arbitrary IP/PORT
	local ip = mySocket:getsockname ()
	mySocket: close()
	return ip or "127.0.0.1"
end


local function getStateTransitions(lul_device, stateid, cells )
	debug(string.format("Wkflow - getStateTransitions(%s)",lul_device))
	local result = {}
	for k,cell in pairs(cells) do
		if ((cell.type=="fsa.Arrow" or cell.type=="link") and cell.source.id==stateid ) then
			table.insert(  result , cell )
		end
	end
	debug(string.format("Wkflow - getStateTransitions(%s) returns %d transitions",lul_device,#result))
	return result
end

-- var waitForState = {
	-- altuiid: ids[0],
	-- state: ids[1]
-- };

local function findWorkflowTrigger( lul_device, altuiid, state, listener_altuiid, listener )
	debug(string.format("findWorkflowTrigger(%s,%s,%s,%s,%s)",lul_device, altuiid, state, listener_altuiid, listener ))
	if (WorkflowTriggers[listener_altuiid] ~= nil  and WorkflowTriggers[listener_altuiid][altuiid] ~= nil and WorkflowTriggers[listener_altuiid][altuiid][state]~= nil) then
		for found,_listener in ipairs(WorkflowTriggers[listener_altuiid][altuiid][state]) do
			if (listener == _listener) then
				return found
			end
		end
	end
	return nil
end

local function addWorkflowTrigger( lul_device, altuiid, state, listener_altuiid, listener )
	debug(string.format("addWorkflowTrigger(%s,%s,%s,%s,%s)",lul_device, altuiid, state, listener_altuiid, listener ))
	if ( findWorkflowTrigger( lul_device, altuiid, state, listener_altuiid, listener ) == nil ) then
		if (WorkflowTriggers[listener_altuiid] == nil) then
			WorkflowTriggers[listener_altuiid]={}
		end
		if (WorkflowTriggers[listener_altuiid][altuiid] == nil) then
			WorkflowTriggers[listener_altuiid][altuiid]={}
		end
		if (WorkflowTriggers[listener_altuiid][altuiid][state] == nil) then
			WorkflowTriggers[listener_altuiid][altuiid][state]={}
		end
		table.insert( WorkflowTriggers[listener_altuiid][altuiid][state] , listener )
		debug(string.format("added transition workflow trigger for listener: %s, %s", listener_altuiid,listener ))
		debug(string.format("WorkflowTriggers: %s", json.encode(WorkflowTriggers) ))
	end
end

local function removeWorkflowTrigger( lul_device, listener_altuiid )

	debug(string.format("removeWorkflowTrigger(%s,%s)",lul_device,	listener_altuiid ))
	WorkflowTriggers[listener_altuiid]=nil

end

local function getWorkflowTriggeredBy( lul_device, altuiid, state )
	debug(string.format("getWorkflowTriggeredBy(%s,%s,%s)",lul_device, altuiid, state ))
	local result = {}
	for listener_altuiid,wt in pairs(WorkflowTriggers) do
		if (WorkflowTriggers[listener_altuiid] ~= nil  and WorkflowTriggers[listener_altuiid][altuiid] ~= nil and WorkflowTriggers[listener_altuiid][altuiid][state]~= nil) then
			table.insert(result, { altuiid=listener_altuiid , links=WorkflowTriggers[listener_altuiid][altuiid][state] } )
		end
	end
	return result
end

local function findWatch( devid, service, variable )
	local watch = nil
	devid = tostring(devid)
	debug(string.format("findWatch(%s,%s,%s)",devid, service, variable))
	debug(string.format("registeredWatches: %s",json.encode(registeredWatches)))
	if (registeredWatches[devid] ~= nil) and (registeredWatches[devid][service] ~= nil) and (registeredWatches[devid][service][variable] ~= nil) then
		return registeredWatches[devid][service][variable]
	end
	warning(string.format("findWatch(%s,%s,%s) did not find a match",devid, service, variable))
	return nil
end

local function _addWatch( service, variable, devid, scene, expression, xml, provider, providerparams )
	debug(string.format("_addWatch(%s,%s,%s,%s,%s,%s,%s,%s)",service, variable, devid, scene, expression, xml or "", provider or "", json.encode(providerparams or "")))
	local data = json.encode(providerparams)
	local result = 1
	local devidstr = tostring(devid)	 -- to inssure it is not a indexed array , but hash table
	local parts = devidstr:altui_split("-")
	if (parts[2]==nil) then
		devidstr = "0-"..devidstr
		parts = devidstr:altui_split("-")
	end
	local bDuplicateWatch = false
	if (registeredWatches[devidstr] == nil) then
		registeredWatches[devidstr]={}
	end
	if (registeredWatches[devidstr][service] == nil) then
		registeredWatches[devidstr][service]={}
	end
	if (registeredWatches[devidstr][service][variable] == nil) then
		registeredWatches[devidstr][service][variable] = {
			["LastOld"] = nil,
			["LastNew"] = nil,
			["LastUpdate"] = nil
		}
	else
		-- a watch was already there
		bDuplicateWatch = true
	end

	if (registeredWatches[devidstr][service][variable]['Expressions'] == nil) then
		registeredWatches[devidstr][service][variable]['Expressions']={}
	end
	if (registeredWatches[devidstr][service][variable]['Expressions'][expression] == nil) then
		registeredWatches[devidstr][service][variable]['Expressions'][expression] = {}
	end

	local n = tablelength(registeredWatches[devidstr][service][variable]['Expressions'][expression])

	if (scene==-2) then
		-- workflow watch
		local bFound = false
		for i=1,n do
			if (registeredWatches[devidstr][service][variable]['Expressions'][expression][i]["WorkflowAltuiID"] == xml ) then
				bFound = true
			end
		end
		if (bFound==false) then
			registeredWatches[devidstr][service][variable]['Expressions'][expression][n+1]= {
				["WorkflowAltuiID"] = xml
			}
		end
	else
		-- classical watch pr
		-- Data Push Configuration
		if (scene==-1) then
			registeredWatches[devidstr][service][variable]['Expressions'][expression][1]= {
				["LastEval"] = nil,
				["SceneID"] = scene
			}
			if (DataProviders[provider]==nil) or ( data=="" )  then
				warning(string.format("Unknown data push provider:%s or data:%s",provider or"", data or ""))
			else
				if (registeredWatches[devidstr][service][variable]['DataProviders'] == nil) then
					registeredWatches[devidstr][service][variable]['DataProviders']={}
				end
				if (registeredWatches[devidstr][service][variable]['DataProviders'][provider] == nil) then
					registeredWatches[devidstr][service][variable]['DataProviders'][provider]={}
				end
				local n2 = tablelength(registeredWatches[devidstr][service][variable]['DataProviders'][provider])
				local bFound = false
				for i=1,n2 do
					if (registeredWatches[devidstr][service][variable]['DataProviders'][provider][i]['Data']==data) then
						bFound = true
					end
				end
				if (bFound==false) then
					registeredWatches[devidstr][service][variable]['DataProviders'][provider][n2+1] = {
						['Data']=data
					}
				end
			end
		else
			local bFound = false
			for i=1,n do
				if (registeredWatches[devidstr][service][variable]['Expressions'][expression][i]["SceneID"] == scene ) then
					bFound = true
				end
			end
			if (bFound==false) then
				registeredWatches[devidstr][service][variable]['Expressions'][expression][n+1]= {
					["LastEval"] = nil,
					["SceneID"] = scene
				}
			end
		end
	end

	if (bDuplicateWatch==true) then
		debug(string.format("Ignoring luup.variable_watch for duplicate watch for %s-%s",service,variable))
		result = 0
	else
		if (parts[1]=="0") then
			-- Master Controller
			luup.variable_watch("variableWatchCallback", service,variable,tonumber(parts[2]))
		else
			-- Secondary Controller
			local extraController= getSetVariable(ALTUI_SERVICE, "ExtraController", lul_device, "")
			local controllers = extraController:altui_split(",")
			local ipaddr =	controllers [ tonumber(parts[1]) ]:trim()
			local url = string.format("http://%s%s/data_request?id=lr_ALTUI_Handler&command=addRemoteWatch&device=%s&variable=%s&service=%s&ctrlid=%s&ipaddr=%s",
				ipaddr,		-- remote ctrl ip addr
				port3480,
				parts[2],	-- pure vera device id on remote controller
				variable,
				service,
				parts[1],	-- controller id for ALTUI
				hostname	-- local IP address for callback
				)
			debug(string.format("Calling url to set remote watch. url:%s",url))
			local httpcode,data = luup.inet.wget(url,10)
			if (httpcode~=0) then
				error(string.format("failed to connect to url:%s, luup.inet.wget returned %d", url,httpcode))
				return 0
			end
			debug(string.format("success httpcode:%s data:%s",httpcode,data))
		end
	end
	debug(string.format("registeredWatches: %s",json.encode(registeredWatches)))
	return result
end

--
-- TIMERS management
-- to persist Vera reboots
--
local function saveTimerDB(lul_device)
	luup.variable_set(ALTUI_SERVICE,  "Timers", json.encode(Timers), tonumber(lul_device))
end

local function findTimerIdx( data )
	debug(string.format("Timer - findTimerIdx(%s)", data))
	local res = 0
	for k,v in pairs(Timers) do
		if (v["data"] == data ) then
			return tonumber(k)
		end
	end
	-- warning(string.format("Timer - timer not found, %s",data))
	return tonumber(res)
end

local function setTimer( lul_device, callbackname, duration, data  )
	debug(string.format("setTimer( %s, %s, %s, %s  )",lul_device, callbackname, duration, data))
	-- check if timer is  already in the database
	local idx = findTimerIdx( data )
	if (idx>0) then
		-- timer is already there
		local timer = Timers[idx]
		if ( timer["armed"] ~= true) then
			warning(string.format("Timer - Timer is present in Timer DB , but not armed. this is ok during startup"))
		else
			debug(string.format("Timer - Timer is already present in Timer DB and already armed"))
		end
	else
		-- not yet there, so set it now
		local timer = {
			["callback"]=callbackname,
			["expireson"]=os.time()+duration,
			["data"]=data,
			["armed"]=true,
		}
		table.insert(Timers, timer)
		debug(string.format("Timer - Timers DB after setTimer: %s",json.encode(Timers)))
		saveTimerDB(lul_device)
		luup.call_delay("TimerManagerCallback", duration, data)
	end
end

local function processTimers(lul_device)
	debug(string.format("Timer - processTimers(%s))", lul_device))
	debug(string.format("Timer - processTimers Timers DB before : %s", json.encode(Timers)))
	local res = 0
	local tocall = {}
	for k,v in pairs(Timers) do
		if (v["armed"] ~= true) then
			local now = os.time()
			if (now > v["expireson"]) then
				-- if timer expired, process it
				-- do not call it as the TImerManagerCallback will modify the Timer table
				table.insert(tocall, v["data"])
			else
				-- if timer did expire yet, reschedule it
				local duration = v["expireson"] - now
				Timers[k]["armed"]=true
				luup.call_delay("TimerManagerCallback", duration, v["data"])
			end
		else
			debug(string.format("Timer - already armed in Lua - wait for the callback "))
		end
	end
	saveTimerDB(lul_device)
	for k,v in pairs(tocall) do
		debug(string.format("Timer - Launching the already expired timer: ", v))
		TimerManagerCallback(v)
	end
	debug(string.format("Timer - processTimers Timers DB after: %s", json.encode(Timers)))
end

local function initTimers(lul_device)
	debug(string.format("Timer - initTimers lul_device:%d ",lul_device))
	local str = getSetVariable(ALTUI_SERVICE, "Timers", lul_device, "")
	Timers = json.decode( str ) or {}
	for k,v in pairs(Timers) do
		Timers[k]["armed"] = false
	end
	saveTimerDB(lul_device)
	debug(string.format("Timer - Timers %s ",json.encode(Timers)))
end

local function cancelTimer(lul_data)
	debug(string.format("Timer - cancelTimer(%s)",lul_data))
	local idx = findTimerIdx( lul_data )
	if (idx>0) then
		local parts = lul_data:altui_split('#')
		local timer = Timers[idx]
		--- remove the timer from the database
		debug( string.format("Timer - cancelling Timer:%s",json.encode(timer) ) )
		table.remove(Timers, idx)
		--- save the database
		luup.variable_set(ALTUI_SERVICE,  "Timers", json.encode(Timers), tonumber(parts[1]))
	end
end

local function cancelWorkflowTimers(lul_device,workflow_idx)
	debug( string.format("Wkflow - cancelling all timers for workflow idx:%d",tonumber(workflow_idx) ) )
	local to_remove={}
	for k,v in pairs(Timers) do
		local parts = v["data"]:altui_split('#')	-- {lul_device,workflow_idx,stateid,targetstate,link.id}
		if (tostring(workflow_idx) == parts[2]) then	-- same workflow
			--- remove the timer from the database after this loop
			debug( string.format("Timer - cancelling Timer:%s",json.encode(v) ) )
			table.insert(to_remove,k)
		end
	end
	for k,v in pairs(to_remove) do
		table.remove(Timers, v)
	end
	--- save the database
	luup.variable_set(ALTUI_SERVICE,  "Timers", json.encode(Timers), tonumber(lul_device))
end

local function cancelStateTimers(lul_device,workflow_idx,stateid)
	debug( string.format("Wkflow - cancelling all timers for workflow idx:%d state:%s",tonumber(workflow_idx) ,stateid) )
	local to_remove={}
	for k,v in pairs(Timers) do
		local parts = v["data"]:altui_split('#')	-- {lul_device,workflow_idx,stateid,targetstate,link.id}
		if (tostring(workflow_idx) == parts[2]) and ( parts[3] == stateid )	 then	-- same workflow and state
			--- remove the timer from the database after this loop
			debug( string.format("Timer - cancelling Timer:%s",json.encode(v) ) )
			table.insert(to_remove,k)
		end
	end
	for k,v in pairs(to_remove) do
		table.remove(Timers, v)
	end
	--- save the database
	luup.variable_set(ALTUI_SERVICE,  "Timers", json.encode(Timers), tonumber(lul_device))
end

function TimerManagerCallback(lul_data)
	debug(string.format("Timer - TimerManagerCallback(%s)",lul_data))
	debug(string.format("Timer - Timers DB before callback: %s",json.encode(Timers)))
	--- find the timer in the database
	local idx = findTimerIdx( lul_data )
	if (idx>0) then
		local parts = lul_data:altui_split('#')
		local timer = Timers[idx]
		local now=os.time()
		debug(string.format("Timer - now:%s timer.expireson:%s",tostring(now),tostring(timer.expireson)))
		if (now < timer.expireson-1) then
			warning(string.format("Timer - receiving timer callback is earlier by more than 1 sec than planned. ignoring...now:%s timer.expireson:%s",tostring(now),tostring(timer.expireson)))
			return
		end
		local expireson = timer.expireson
		--- remove the timer from the database
		table.remove(Timers, idx)
		debug(string.format("Timer - Timers DB after callback: %s",json.encode(Timers)))

		--- save the database
		saveTimerDB( tonumber(parts[1]) )

		--- execute its callback function
		if (timer.callback == "workflowTimerCB") then
			workflowTimerCB(lul_data)
		elseif (timer.callback == "watchTimerCB") then
			watchTimerCB(lul_data)
		end
	else
		warning(string.format("Timer - Timer not found in Timer DB, lul_data:"..lul_data.." Timers:"..json.encode(Timers)))
	end
end


------------------------------------------------
-- Workflows
------------------------------------------------

local function getCellName(link)
	local name = ""
	-- Check name for Link or for START state
	if (link.labels ~=nil ) then
		name = link.labels[1].attrs.text.text
	else
		if (link.attrs.text ~= nil) then
			name = link.attrs.text.text
		else
			name = 'Start'
		end
	end
	return name
end

-- get workflow description from the store variables
local function getWorkflowsDescr(lul_device)
	local workflows={}
	debug(string.format("Wkflow - getWorkflowsDescr(%s)",lul_device))
	local workflowlist = getDataFor( lul_device, "Workflows", "Wflow_" ) or "{}"
	if (workflowlist=="[]") then
		workflowlist="{}"
	end
	local workflows_tbl = json.decode( workflowlist )
	for k,v in pairs(workflows_tbl) do
		local data = getDataFor( lul_device, v , "Wflow_")

		local status,results = pcall( json.decode, data)
		if (status==true) then
			if (results~=nil) then
				workflows[ #workflows +1 ] = results
			else
				error(string.format("Wkflow - getWorkflowsDescr failed to decoded the json	%s",  data	))
			end
		else
			error(string.format("Wkflow - getWorkflowsDescr failed to decoded the json	%s",  data	))
		end

	end
	
	-- unpacking the graph json for all
	for k,v in pairs(workflows) do
		local status,results = pcall( json.decode, v["graph_json"])
		if (status==true) then
			workflows[k]["graph_json"] = results
		else
			error(string.format("Wkflow - initWorkflows fails to decode graph string for workflow %s", v.altuiid ))
			workflows[k]["graph_json"] = {
				cells={}
			}
		end
	end
	
	debug(string.format("Wkflow - getWorkflowsDescr returning %s",	json.encode(workflows)	))
	return workflows
end

local function findStartState(idx)
	debug(string.format("Wkflow - findStartState(%d)",idx))
	if (Workflows[idx]==nil or Workflows[idx]["graph_json"]==nil or Workflows[idx]["graph_json"].cells==nil) then
		return nil
	end
	local wflow = Workflows[idx]["graph_json"]
	for i,cell in pairs(wflow.cells) do
		if (cell.prop.stateinfo.bStart==true) then
			debug(string.format("Wkflow - findStartState(%d) returns %s",idx,cell.id))
			return cell
		end
	end
	warning(string.format("Wkflow - findStartState(%d) could not find start state",idx))
	return nil
end

local function findStartStateID(idx)
	debug(string.format("Wkflow - findStartStateID(%d)",idx))
	local cell = findStartState(idx)
	if (cell~=nil) then
		return cell.id
	end
	return nil
end

local function getWorkflowsStatus(lul_device)
	return WorkflowsActiveState;
end

local function stateFromID(cells,stateID)
	for k,cell in pairs(cells) do
		if (cell.type~="link" and cell.type~="fsa.Arrow" and cell.id==stateID) then
			return cell
		end
	end
	return nil
end
local function isValidState(workflow,stateID)
	return stateFromID(workflow["graph_json"].cells,stateID) ~= nil
end
local function linkFromID(cells,stateID)
	for k,cell in pairs(cells) do
		if ( (cell.type=="fsa.Arrow" or cell.type=="link") and cell.id==stateID) then
			return cell
		end
	end
	return nil
end

local function setWorkflowActiveState(lul_device,workflow_idx,newstate)
	if (newstate ~= nil) then
		debug(string.format("Wkflow - setWorkflowActiveState: '%s', %s, %s",Workflows[workflow_idx].altuiid , getCellName(newstate), newstate.id))
		Workflows[workflow_idx]["graph_json"].active_state = newstate.id
		WorkflowsActiveState[ Workflows[workflow_idx].altuiid ] = newstate.id
		luup.variable_set(ALTUI_SERVICE, "WorkflowsActiveState", json.encode(WorkflowsActiveState), tonumber(lul_device))
	else
		error(string.format("Wkflow - setWorkflowActiveState: '%s', %s, %s",Workflows[workflow_idx].altuiid , "null", "null"))
	end
end

local function armLinkTransitions(lul_device,workflow_idx,curstate)
	local name = ""
	-- Check name for Link or for START state
	name = getCellName(curstate)

	debug(string.format("Wkflow - armLinkTransitions(%s, %s, %s ) ",lul_device, Workflows[workflow_idx].name, name))
	local altuiid = Workflows[workflow_idx].altuiid
	local cells = Workflows[workflow_idx]["graph_json"].cells
	local transitions = getStateTransitions(lul_device, curstate.id, cells )
	for k,link in pairs(transitions) do
		-- Set Timers
		if (link.prop.timer ~= "") then
			link.prop.expired = false
			local tbl = {lul_device,workflow_idx,curstate.id,link.target.id,link.id}
			debug(string.format("Wkflow - Arming Timer (%s, %s) ",lul_device, json.encode(tbl)))
			debug(string.format("Wkflow - link props:%s",json.encode(link.prop)))
			local duration = tonumber( link.prop.duration )
			if (duration~=nil) then
				if (duration >0) then
					setTimer( lul_device, "workflowTimerCB",duration,table.concat(tbl, "#")	 )
				else
					-- 0 duration means immediate, we continue the workflow immediately
					setTimer( lul_device, "workflowTimerCB",duration,table.concat(tbl, "#")	 )
					-- workflowTimerCB(table.concat(tbl, "#"))
				end
			else
				if (link.prop.duration:starts("Bag")==true) then
					debug(string.format("Wkflow - arming timer with Bag value %s",link.prop.duration))
					duration = _evalCode(link.prop.duration,workflow_idx)
					if (duration == nil) then
						duration = 10
					end
				else
					-- min, max generates a random
					local parts = link.prop.duration:altui_split("-")
					duration = math.random(parts[1],parts[2])
				end
				debug(string.format("Wkflow - arming timer with random duration %d",duration))
				setTimer( lul_device, "workflowTimerCB",duration,table.concat(tbl, "#")	 )
			end
		end

		-- Set Watches, make sure we have a watch for all the conditions
		for c,cond in pairs(link.prop.conditions) do
			-- table.insert(WorkflowWatches,{ cond.device, cond.service, cond.variable, cond.luaexpr })
			_addWatch( cond.service, cond.variable, cond.device, -2, "workflow", altuiid, "", "" )
		end

		-- Set Workflow State Waits
		if (link.prop.workflows ~= nil) then
			for w,waitfor in pairs(link.prop.workflows) do
				addWorkflowTrigger( lul_device, waitfor.altuiid, waitfor.state, altuiid, link.id )
			end
		end
		-- TODO xxx
	end

	-- add start state conditions
	local cell = findStartState(workflow_idx)
	if (cell ~= nil and cell.prop.conditions ~= nil) then
		for c,cond in pairs(cell.prop.conditions) do
			-- table.insert(WorkflowWatches,{ cond.device, cond.service, cond.variable, cond.luaexpr })
			_addWatch( cond.service, cond.variable, cond.device, -2, "workflow", Workflows[workflow_idx].altuiid, "", "" )
		end
	end
end

--
-- Init Workflows
-- get workflow description from the store variables
-- prepare the watches
--
local function initWorkflows(lul_device,pendingReset)
	pendingReset = tonumber(pendingReset) or 0
	debug(string.format("Wkflow - initWorkflows(%s,%d)",lul_device,pendingReset))

	-- get active states for persistency
	WorkflowsActiveState = json.decode( getSetVariable(ALTUI_SERVICE, "WorkflowsActiveState", lul_device, "") ) or {}
	WorkflowsVariableBag = json.decode( getSetVariable(ALTUI_SERVICE, "WorkflowsVariableBag", lul_device, "") ) or {}
	debug(string.format("Wkflow - WorkflowsActiveState = %s",json.encode(WorkflowsActiveState)))

	Workflows = getWorkflowsDescr(lul_device)

	-- decode the graph json which is stored as a string inside the string
	for k,v in pairs(Workflows) do

		if (WorkflowsVariableBag[Workflows[k].altuiid]==nil) then
			WorkflowsVariableBag[Workflows[k].altuiid] = {}
		end

		-- try the	stored active state
		if (pendingReset==1) then
			-- RESET normal start, resume from start state
			local state = findStartState(k)
			setWorkflowActiveState(lul_device,k,state)
		else
			-- normal start, resume current active state
			local last_known_active = WorkflowsActiveState[ Workflows[k].altuiid ]
			if ( (last_known_active == nil) or ( isValidState(Workflows[k],last_known_active)==false ) ) then
				-- try the one stored in the workflow descr
				last_known_active = Workflows[k]["graph_json"].active_state
				if ( (last_known_active == nil) or ( isValidState(Workflows[k],last_known_active)==false ) ) then
					-- if no active state or state is unknown, start from START
					local state = findStartState(k)
					setWorkflowActiveState(lul_device,k,state)
				else
					WorkflowsActiveState[ Workflows[k].altuiid ]= last_known_active
				end
			else
				-- also save it in workflow descr
				Workflows[k]["graph_json"].active_state = last_known_active
			end
		end
	end

	-- save active states for persistency
	luup.variable_set(ALTUI_SERVICE, "WorkflowsActiveState", json.encode(WorkflowsActiveState), lul_device)

	if (WFLOW_MODE==true) then
		-- local WorkflowWatches = {}
		for workflow_idx,workflow in pairs(Workflows) do
			local curstate = stateFromID(workflow["graph_json"].cells  , Workflows[workflow_idx]["graph_json"].active_state)
			if (curstate == nil ) then
				curstate  = stateFromID(workflow["graph_json"].cells  , findStartStateID(workflow_idx) )
			end
			if (curstate ~= nil) then
				armLinkTransitions(lul_device,workflow_idx,curstate)
			else
				error(string.format("Wflow - Cannot start to arm worklow %s as curtstate is null",workflow.altuiid))
			end
		end
	end
	-- debug(string.format("Wkflow - WorkflowWatches: %s",json.encode(WorkflowWatches)))
	debug(string.format("Wkflow - initWorkflows:%s",json.encode(Workflows)))
end

local function findWorkflowIdx(workflowAltuiid)
	debug(string.format("findWorkflowIdx(%s)",workflowAltuiid))
	for k,v in pairs(Workflows) do
		if (Workflows[k].altuiid == workflowAltuiid) then
			return k
		end
	end
	warning(string.format("findWorkflowIdx - did not find index, return 0") )
	return 0
end

local function resetWorkflow(lul_device,workflowAltuiid)
	log(string.format("Wkflow - resetWorkflow(%d,%s)",lul_device,workflowAltuiid))
	local workflow_idx = findWorkflowIdx(workflowAltuiid)
	if (workflow_idx>0) then
		-- reset Timers for this workflow
		cancelWorkflowTimers(lul_device,workflow_idx)

		-- reset active state for this workflow
		local start = findStartState(workflow_idx)
		log(string.format(strWorkflowTransitionTemplate, Workflows[workflow_idx].altuiid, "Reset to Start", "*", "Start"));
		setWorkflowActiveState(lul_device,workflow_idx,start)

		-- reset workflow variables
		WorkflowsVariableBag[workflowAltuiid] = {}
		setVariableIfChanged(ALTUI_SERVICE, "WorkflowsVariableBag", json.encode(WorkflowsVariableBag), lul_device)

		-- schedule execution
		if (WFLOW_MODE == true) then
			-- Arm timers and exec Workflows with a delay
			local startstate = stateFromID(Workflows[workflow_idx]["graph_json"].cells,start.id)
			armLinkTransitions(lul_device,workflow_idx,startstate)
			executeWorkflows(lul_device , nil , workflow_idx )
			-- luup.call_delay("executeWorkflows", 2, lul_device)
		end
	else
		warning(string.format("Invalid Workflow altuiid:%s",workflowAltuiid))
	end
end

local function triggerTransition(lul_device,workflowAltuiid,transitionId)
	log(string.format("Wkflow - Workflow:'%s' triggerTransition(%s)",workflowAltuiid,transitionId))
	-- force the transition to happen
	ForcedValidLinks[transitionId] = true

	-- schedule execution
	if (WFLOW_MODE == true) then
		local workflow_idx = findWorkflowIdx(workflowAltuiid)
		if (workflow_idx>0) then
			executeWorkflows(lul_device , nil , workflow_idx )
			-- exec Workflows with a delay
			-- luup.call_delay("executeWorkflows", 1, lul_device)
		else
			warning( string.format("triggerTransition ignored because workflow #%s is not found",workflowAltuiid))
		end
	end
end

local function enableWorkflows(lul_device,newWorkflowMode,pendingReset)
	log(string.format("Wkflow - enableWorkflows(%d,%d,%s)",lul_device,newWorkflowMode,pendingReset or "0"))
	lul_device = tonumber(lul_device)
	newWorkflowMode = tonumber(newWorkflowMode) or 0

	-- local currentMode = luup.variable_get(ALTUI_SERVICE, "EnableWorkflows",	lul_device)
	setVariableIfChanged(ALTUI_SERVICE, "EnableWorkflows", newWorkflowMode, lul_device)
	WFLOW_MODE = (newWorkflowMode == 1)

	if (WFLOW_MODE==false) then
		-- reset Timers
		Timers = {}
		luup.variable_set(ALTUI_SERVICE,  "Timers", "", lul_device)
		-- reset Active States
		WorkflowsActiveState = {}
		WorkflowsVariableBag = {}
		luup.variable_set(ALTUI_SERVICE, "WorkflowsActiveState", "", lul_device)
		luup.variable_set(ALTUI_SERVICE, "WorkflowsVariableBag", "", lul_device)
	end

	-- init Workflows
	initWorkflows(lul_device,pendingReset)

	-- schedule execution
	if (WFLOW_MODE == true) then
		-- exec Workflows with a delay
		luup.call_delay("executeWorkflows", 4, lul_device)
	end
end

local function evaluateStateTransition(lul_device,link, workflow_idx, watchevent)
	local name = getCellName(link)
	debug(string.format("Wkflow - evaluateStateTransition(%s,%s,%s)",lul_device,name,workflow_idx))
	debug(string.format("Wkflow - link props:%s",json.encode(link.prop)))

	-- if scheduled and schedule has been received, then return true
	if (ForcedValidLinks[link.id]==true) then
		ForcedValidLinks[link.id] = nil
		return true
	end
	-- otherwise check if timer expired
	if (link.prop.timer ~= "") and TimersDisabled[workflow_idx] == false then --octo, ignore timer expiry if in the process of enabling them
		debug(string.format("Wkflow - link has a timer."))
		local res = link.prop.expired 
		link.prop.expired = false  
		if (res==true) then
			debug(string.format("Wkflow - link had expired."))  -- octo
			return true
		end
	end
	-- otherwise ( not scheduled and not expired timer ) then continue to evaluates conditions
	if (tablelength(link.prop.conditions)>0) then
		-- conditions
		for k,cond in pairs(link.prop.conditions) do
			local bMatchingWatch = false
			local parts = cond.device:altui_split("-");
			local devid = tonumber(parts[2]);
			local new,old,lastupdate = nil,nil,nil

			if (watchevent~=nil) and (watchevent.device == cond.device) and (watchevent.service == cond.service) and (watchevent.variable == cond.variable) then
				bMatchingWatch = true
				-- if (watchevent.watch['Expressions']['results'] == nil) or (watchevent.watch['Expressions']['results'][cond.luaexpr] == nil)	then
					-- debug(string.format("Wkflow - watchevent value initialized"))
					-- watchevent.watch['Expressions']['results']= {
						-- [cond.luaexpr] = {
							-- OldEval='',
							-- LastEval=''
						-- }
					-- }
					-- debug(string.format("Wkflow - watchevent value expr:%s old:%s new:%s",cond.luaexpr,tostring(watchevent.watch['Expressions']['results'][cond.luaexpr]["OldEval"]),tostring(watchevent.watch['Expressions']['results'][cond.luaexpr]["LastEval"])))
				-- end
			end

			if (cond.triggeronly == true) then
				-- do not accept transition which are not coming from a trigger if the trigger only flag is set
				debug(string.format("Wkflow - Condition %s is TriggerOnly and watchevent:%s",cond.luaexpr,json.encode(watchevent or {})))
				if (bMatchingWatch==false) then
					debug(string.format("Wkflow - ignore transition as the Watch trigger does not match this trigger transition condition:%s",json.encode(cond)))
					return false
				end

				-- must be the same device service variable, otherwise, reject
				new,old,lastupdate = watchevent.watch["LastNew"],watchevent.watch["LastOld"],watchevent.watch["LastUpdate"]
			else
				-- evaluate in real time
				debug(string.format("Wkflow - Condition %s is evaluated in real time - no TriggerOnly",cond.luaexpr))
				new,old,lastupdate = luup.variable_get(cond.service, cond.variable, devid ) , "" , os.time()
			end

			old = old or ""
			new = new or ""
			local results = _evaluateUserExpression(lul_device,devid, cond.service, cond.variable,old,new,lastupdate,cond.luaexpr,workflow_idx)

			local res,delay = results[1], results[2] or nil
			if (  res ~= true) then
				return false
			end
		end
		return true	-- logical AND of all expressions
	end
	return false
end

-- "onEnter": [
  -- {
	-- "device": "0-6",
	-- "service": "urn:upnp-org:serviceId:SwitchPower1",
	-- "action": "SetTarget",
	-- "arguments": [
	  -- {
		-- "name": "newTargetValue",
		-- "value": "0"
	  -- }
	-- ]
  -- }
-- ],

local function executeStateLua(lul_device,workflow_idx,state,label)
	debug(string.format("Wkflow - Workflow:'%s' executeStateLua(%s, %s) ",Workflows[workflow_idx].name, getCellName(state),label))
	local  lua = state.prop[label] or ""
	if (lua:len()>0) then
		debug(string.format("Wkflow - %s Lua code=%s",label,lua))
		local f,msg = loadstring(lua,"ALTUI - executeStateLua")
		if (f==nil) then
			error(string.format("Wkflow - loadstring %s failed to compile, msg=%s",lua,msg))
		else
			local env = { ALTUI=ALTUI, Bag = WorkflowsVariableBag[ Workflows[workflow_idx].altuiid ] , WorkflowsVariableBag=WorkflowsVariableBag}
			setfenv(f, setmetatable (env, {__index = _G, __newindex = _G}))
			local status,res= pcall(  f )

			-- results = func(lul_device, lul_service, lul_variable,expr)
			if (status==true) then
				WorkflowsVariableBag[ Workflows[workflow_idx].altuiid ] = env.Bag
				setVariableIfChanged(ALTUI_SERVICE, "WorkflowsVariableBag", json.encode(WorkflowsVariableBag), lul_device)
				debug(string.format("Wkflow - Lua code res:%s, Bag=%s",tostring(res),json.encode(WorkflowsVariableBag[ Workflows[workflow_idx].altuiid ])))
			else
				error(string.format("Wkflow - Lua code Exception occured, Err Msg: %s",res))
			end
		end
	end
end

local function executeStateScenes(lul_device,workflow_idx,state,label)
	debug(string.format("Wkflow - Workflow:'%s' executeStateScenes(%s, %s) ",Workflows[workflow_idx].name, getCellName(state),label))
	debug(string.format("state.prop %s",json.encode(state.prop)))
	for k,scene in pairs( state.prop[label] or {} ) do
		local parts = scene.altuiid:altui_split("-")
		local scene_res =run_scene(parts[2])
		if (scene_res==-1) then
			error(string.format("Failed to run the scene %s",scene.altuiid))
		end
	end
end

local function executeStateActions(lul_device,workflow_idx,state,label)
	debug(string.format("Wkflow - Workflow:'%s' executeStateActions(%s, %s) ", Workflows[workflow_idx].name, getCellName(state),label))
	debug(string.format("state.prop %s",json.encode(state.prop)))
	for k,action in pairs( state.prop[label] or {} ) do
		local parts = action.device:altui_split("-")
		local params = table2params(Workflows[workflow_idx].altuiid, action.arguments)
		call_action(action.service,action.action,params,tonumber(parts[2]))
	end
end

local function nextWorkflowState(lul_device,workflow_idx,oldstate, newstate,comment)
	if (WFLOW_MODE==true) and (newstate.id ~= oldstate.id ) then
		log(string.format(strWorkflowTransitionTemplate, Workflows[workflow_idx].altuiid, comment or "", getCellName(oldstate), getCellName(newstate)));

		-- cancel timers originated from that state
		cancelStateTimers(lul_device,workflow_idx,oldstate.id)
		removeWorkflowTrigger(lul_device,Workflows[workflow_idx].altuiid)

		-- execute onExit of old state
		TimersDisabled[workflow_idx] = true -- octo - stop timers getting cleared as they are currently expired
		executeStateLua(lul_device,workflow_idx,oldstate,"onExitLua")
		executeStateActions(lul_device,workflow_idx,oldstate,"onExit")
		executeStateScenes(lul_device,workflow_idx,oldstate,"onExitScenes")

		-- change active state
		setWorkflowActiveState(lul_device,workflow_idx,newstate)

		-- execute onEnter of new state
		executeStateLua(lul_device,workflow_idx,newstate,"onEnterLua")
		executeStateActions(lul_device,workflow_idx,newstate,"onEnter")
		executeStateScenes(lul_device,workflow_idx,newstate,"onEnterScenes")
		armLinkTransitions(lul_device,workflow_idx,newstate)
		TimersDisabled[workflow_idx] = false --octo - timers are now running

		-- execute all other workflows triggered by that new state
		local to_launch = getWorkflowTriggeredBy( lul_device, Workflows[workflow_idx].altuiid, newstate.id )
		for _altui,v in pairs(to_launch) do
			debug(string.format("Launching workflow:%s Link:%s",v.altuiid , json.encode(v.links)))
			triggerTransition(lul_device,v.altuiid,v.links[1])
		end

		-- next iteration
		executeWorkflows(lul_device , nil , workflow_idx )
		-- let some time pass up so that actions can be executed, then re-evaluate the workflow
		-- luup.call_delay("executeWorkflows", 4, lul_device)
	end
end

local function evalWorkflowState(lul_device, workflow_idx, watchevent )
	debug(string.format("Wkflow - evalWorkflowState(%s, %s), workflow:%s",lul_device, workflow_idx, Workflows[workflow_idx].name))
	local stateid = Workflows[workflow_idx]["graph_json"].active_state
	local cells = Workflows[workflow_idx]["graph_json"].cells
	local oldstate = stateFromID(cells,stateid)

	-- add start state conditions. Start State is like a link object and has same properties as a link
	-- if workflow is paused, or if Start transitions are matching, move to start
	local start = findStartState(workflow_idx)
	if (start == nil) then
		error(string.format("Wkflow - null start state, cannot evaluate workflow. delete this workflow"))
		return false
	end
	if (oldstate == nil ) then
		oldstate = start
	end
	debug(string.format("Wkflow - active state:%s, %s", stateid,getCellName(oldstate)))

	local evalstartcond = evaluateStateTransition(lul_device,start,workflow_idx,watchevent)
	local blocked = Workflows[workflow_idx].blocked or Workflows[workflow_idx].paused	-- blocked by start conditions or by user request
	debug(string.format("Wkflow - blocked:%s, paused:%s", tostring(Workflows[workflow_idx].blocked or false), tostring(Workflows[workflow_idx].paused or false))) --octo

	if (blocked==true) then
		if (evalstartcond==true) then
			-- remains as it is
			debug(string.format("Wkflow - Workflow: %s, is blocked in start state , ID:%s", Workflows[workflow_idx].altuiid,start.id))
			return false	-- do not evaluate outgoing transitions
		else
			-- TODO restart the workflow so it could progress
			if (Workflows[workflow_idx].paused == true) then
				-- if paused manually, do not rearm
				nextWorkflowState( lul_device, workflow_idx, oldstate, start,"Reset to Start")
				return false	-- do not evaluate outgoing transitions
			else
				Workflows[workflow_idx].blocked = false
				armLinkTransitions(lul_device,workflow_idx,start)
			end
		end
	else
		if (evalstartcond==true) then
			--- reset workflow to START state
			Workflows[workflow_idx].blocked = true
			if (oldstate.id == start.id) then
				--- if already in START state
				log(string.format("Wkflow - Workflow: %s, already in start state , ID:%s", Workflows[workflow_idx].altuiid,start.id))
			else
				-- log(string.format(strWorkflowTransitionTemplate, Workflows[workflow_idx].altuiid, "Reset to Start", oldstate.attrs.text.text, start.attrs.text.text))
				nextWorkflowState( lul_device, workflow_idx, oldstate, start,"Reset to Start")
			end
			return true
		end
		-- falls back to the normal processing
	end

	--
	-- not blocked ,  and normal processing required
	--
	local transitions = getStateTransitions(lul_device, stateid, cells )
	for k,link in pairs(transitions) do
		if (evaluateStateTransition(lul_device,link,workflow_idx,watchevent)) then
			-- possible target state
			local targetstate = stateFromID(cells,link.target.id)

			-- cancel link timer if needed as the link could have both conditions which fired TRUE and a timer
			if (link.prop.timer ~= "") then
				local tbl = {lul_device,workflow_idx,stateid,link.target.id,link.id}
				cancelTimer( table.concat(tbl, "#") )
			end

			debug(string.format(strWorkflowTransitionTemplate, Workflows[workflow_idx].altuiid, link.labels[1].attrs.text.text, oldstate.attrs.text.text, targetstate.attrs.text.text)); --Octo
			nextWorkflowState( lul_device, workflow_idx, oldstate, targetstate , getCellName(link))
			return true;	-- todo
		end
	end
	debug(string.format("Wkflow - No valid transition found"));
	return false;
end

function workflowTimerCB(lul_data)
	if (WFLOW_MODE==true) then
		log(string.format("Wkflow - workflowTimerCB(%s)",lul_data))
		local parts = lul_data:altui_split('#')
		local lul_device,workflow_idx,timerstateid,targetstateid,linkid = parts[1],tonumber(parts[2]),parts[3],parts[4],parts[5]

		-- is workflow paused ?
		local start = findStartState(workflow_idx)
		if ( (Workflows[workflow_idx].paused==true) or (Workflows[workflow_idx].blocked==true) or (evaluateStateTransition(lul_device,start,workflow_idx,nil)) ) then
			debug(string.format("Wkflow - %s paused or blocked in start state or start conditions evaluates to true => ignoring timer",Workflows[workflow_idx].name))
			return
		end

		-- is timer obsolete ?
		-- are we still in the same state ?
		local active_state = Workflows[workflow_idx]["graph_json"].active_state		-- id of active state
		debug(string.format("Wkflow - %s, active state:%s timerstate:%s",Workflows[workflow_idx].name,active_state or 'nil',timerstateid or 'nil'))
		if (active_state == timerstateid) then
			-- if yes, execute link transition
			local cells = Workflows[workflow_idx]["graph_json"].cells
			local link = linkFromID(cells,linkid)
			link.prop.expired = true
			local oldstate = stateFromID(cells,active_state)
			local targetstate = stateFromID(cells,targetstateid)
			debug(string.format("Wkflow - link prop:%s",json.encode(link.prop)))
			-- log(string.format(strWorkflowTransitionTemplate, Workflows[workflow_idx].altuiid, "Timer:"..getCellName(link), oldstate.attrs.text.text, targetstate.attrs.text.text));
			nextWorkflowState( lul_device, workflow_idx, oldstate, targetstate,"Timer:"..getCellName(link) )
		else
			warning(string.format("Wkflow - Timer - Timer ignored, active state is different from the timer state"))
		end
	end
end

-- not local as used in luup.call_delay
function executeWorkflows(lul_device , watchevent , workflow_idx )
	if (WFLOW_MODE==true) then
		debug(string.format("Wkflow - executeWorkflows(%s , %s)",lul_device,json.encode(watchevent)))

		if (workflow_idx~=nil) then
			evalWorkflowState( lul_device, workflow_idx, watchevent )
		elseif (watchevent~=nil) then
			debug(string.format("Wkflow - executeWorkflows limited to specific workflows"))
			for k,v in pairs(watchevent.watch['Expressions']['workflow']) do
				workflow_idx = findWorkflowIdx(v.WorkflowAltuiID)
				if (workflow_idx>0) then
					evalWorkflowState( lul_device, workflow_idx, watchevent )
				else
					warning( string.format("executeWorkflows watchevent is ignored because workflow #%s is not found",v.WorkflowAltuiID))
				end
			end
		else
			for k,v in pairs(Workflows) do
				evalWorkflowState( lul_device, k , watchevent )
			end
		end

		-- all evaluated, so now reset	any forced valid link to {}
		ForcedValidLinks={}
		return
	end
	warning(string.format("Wkflow - executeWorkflows ignored, WFLOW_MODE disabled"))
end

--
-- MULTI Controller management
--
function proxyGet(lul_device,newUrl,resultName)
	debug(string.format("proxyGet lul_device:%d newUrl:%s",lul_device,newUrl))
	local httpcode,data = luup.inet.wget(newUrl,10)
	if (httpcode~=0) then
		error(string.format("failed to connect to url:%s, http.request returned %d", newUrl,httpcode))
		return 0,"";
	end
	debug(string.format("success httpcode:%s",httpcode))
	debug(string.format("data:%s",data))
	return 1,data
end

--
-- WARNING the SOAPACTION header requires to be inside double quotes
-- otherwise it RETURNS http500
--
function proxySoap(lul_device,newUrl,soapaction,envelop,body)
	debug(string.format("proxySoap lul_device:%d soapaction:%s",lul_device,soapaction))
	debug(string.format("body:%s",body))
	local mybody = string.format(envelop,xml_encode(body))
	debug(string.format("mybody:%s",mybody))
	local result = {}
	local request, code = http.request({
		method="POST",
		url = newUrl,
		source= ltn12.source.string(mybody),
		headers = {
			-- ["Host"]="192.168.1.5",
			["Connection"]= "keep-alive",
			["Content-Length"] = mybody:len(),
			-- ["Origin"]="http://192.168.1.5",
			-- ["User-Agent"]="Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36",
			["Content-Type"] = "text/xml;charset=UTF-8",
			["Accept"]="text/plain, */*; q=0.01",
			-- ["X-Requested-With"]="XMLHttpRequest",
			["Accept-Encoding"]="gzip, deflate",
			["Accept-Language"]= "fr,fr-FR;q=0.8,en;q=0.6,en-US;q=0.4",
			["SOAPACTION"]='"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#' .. soapaction..'"'
		},
		sink = ltn12.sink.table(result)
	})

		-- fail to connect
	if (request==nil) then
		error(string.format("failed to connect to %s, http.request returned nil", newUrl))
		return 0,""
	elseif (code==401) then
		warning(string.format("Access requires a user/password: %d", code))
		return 0,""
	elseif (code~=200) then
		warning(string.format("http.request returned a bad code: %d", code))
		return 0,""
	end

	-- everything looks good
	local data = table.concat(result)
	debug(string.format("request:%s",request))
	debug(string.format("code:%s",code))

	return 1,data
end

--
-- code from lolodomo in DNLA plugin
--
local function table2XML(value)
	--debug(string.format("table2XML(%s)",json.encode(value)))
	local result = ""
	if (value == nil) then
		return result
	end
	--
	-- Convert all the Number, Boolean and Table objects, and escape all the string
	-- values in the XML output stream
	--
	-- If value table has an entry OrderedArgs, we consider that all the values
	-- are set in this special entry and we bypass all the other values of the value table.
	-- In this particular case, this entry itself is a table of strings, each element of
	-- the table following the format "parameter=value"
	--
	for e, v in pairs(value) do
		if (v == nil) then
			result = result .. string.format("<%s />", e)
		elseif (type(v) == "table") then
			result = result .. table2XML(v)
		elseif (type(v) == "number") then
			result = result .. string.format("<%s>%.0f</%s>", e, v, e)
		elseif (type(v) == "boolean") then
			result = result .. string.format("<%s>%s</%s>", e, (v and "1" or "0"), e)
		else
			result = result .. string.format("<%s>%s</%s>", e, xml_encode(v), e)
		end
	end
	return result
end


------------------------------------------------
-- Check UI7
------------------------------------------------
local function checkVersion(lul_device)
	local ui7Check = luup.variable_get(ALTUI_SERVICE, "UI7Check", lul_device) or ""
	if ui7Check == "" then
		luup.variable_set(ALTUI_SERVICE, "UI7Check", "false", lul_device)
		ui7Check = "false"
	end
	if( luup.version_branch == 1 and luup.version_major == 7 and ui7Check == "false") then
		luup.variable_set(ALTUI_SERVICE, "UI7Check", "true", lul_device)
		luup.attr_set("device_json", UI7_JSON_FILE, lul_device)
		luup.reload()
	end
end

local function getSysinfo(ip)
	--http://192.168.1.5/cgi-bin/cmh/sysinfo.sh
	log(string.format("getSysinfo(%s)",ip))
	local url=string.format("http://%s/cgi-bin/cmh/sysinfo.sh",ip)
	local timeout = 30
	local httpcode,content = luup.inet.wget(url,timeout)
	if (httpcode==0) then
		local obj = json.decode(content)
		debug("sysinfo="..content)
		return obj
	end
	return nil
end

------------------------------------------------
-- Tasks
------------------------------------------------
local taskHandle = -1
local TASK_ERROR = 2
local TASK_ERROR_PERM = -2
local TASK_SUCCESS = 4
local TASK_BUSY = 1

--
-- Has to be "non-local" in order for MiOS to call it :(
--
local function task(text, mode)
	if (mode == TASK_ERROR_PERM)
	then
		error(text)
	elseif (mode ~= TASK_SUCCESS)
	then
		warning(text)
	else
		log(text)
	end
	if (mode == TASK_ERROR_PERM)
	then
		taskHandle = luup.task(text, TASK_ERROR, MSG_CLASS, taskHandle)
	else
		taskHandle = luup.task(text, mode, MSG_CLASS, taskHandle)

		-- Clear the previous error, since they're all transient
		if (mode ~= TASK_SUCCESS)
		then
			luup.call_delay("clearTask", 15, "", false)
		end
	end
end

function clearTask()
	task("Clearing...", TASK_SUCCESS)
end

function UserMessage(text, mode)
	mode = (mode or TASK_ERROR)
	task(text,mode)
end

function clearAltuiFile(param)
	if (string.len(param)>0) then
		os.execute("rm /www/altui/"..param)
	end
end

------------------------------------------------
-- LUA Utils
------------------------------------------------
local function Split(str, delim, maxNb)
	-- Eliminate bad cases...
	if string.find(str, delim) == nil then
		return { str }
	end
	if maxNb == nil or maxNb < 1 then
		maxNb = 0	 -- No limit
	end
	local result = {}
	local pat = "(.-)" .. delim .. "()"
	local nb = 0
	local lastPos
	for part, pos in string.gmatch(str, pat) do
		nb = nb + 1
		result[nb] = part
		lastPos = pos
		if nb == maxNb then break end
	end
	-- Handle the last field
	if nb ~= maxNb then
		result[nb + 1] = string.sub(str, lastPos)
	end
	return result
end

function string:altui_split(sep) -- from http://lua-users.org/wiki/SplitJoin	 : changed as consecutive delimeters was not returning empty strings
	return Split(self, sep)
end


function string:template(variables)
	return (self:gsub('@(.-)@',
		function (key)
			return tostring(variables[key] or '')
		end))
end

function string:trim()
  return self:match "^%s*(.-)%s*$"
end

------------------------------------------------
-- VERA Device Utils
------------------------------------------------

-- example: iterateTbl( t , luup.log )
local function forEach( tbl, func, param )
	for k,v in pairs(tbl) do
		func(k,v,param)
	end
end

function tablelength(T)
  local count = 0
  if (T~=nil) then
	for _ in pairs(T) do count = count + 1 end
  end
  return count
end

function inTable(tbl, item)
	for key, value in pairs(tbl) do
		if value == item then return key end
	end
	return false
end

local function getParent(lul_device)
	return luup.devices[lul_device].device_num_parent
end

local function getAltID(lul_device)
	return luup.devices[lul_device].id
end

-----------------------------------
-- from a altid, find a child device
-- returns 2 values
-- a) the index === the device ID
-- b) the device itself luup.devices[id]
-----------------------------------
local function findChild( lul_parent, altid )
	debug(string.format("findChild(%s,%s)",lul_parent,altid))
	for k,v in pairs(luup.devices) do
		if( getParent(k)==lul_parent) then
			if( v.id==altid) then
				return k,v
			end
		end
	end
	return nil,nil
end

local function forEachChildren(parent, func, param )
	--debug(string.format("forEachChildren(%s,func,%s)",parent,param))
	for k,v in pairs(luup.devices) do
		if( getParent(k)==parent) then
			func(k, param)
		end
	end
end

local function getForEachChildren(parent, func, param )
	--debug(string.format("forEachChildren(%s,func,%s)",parent,param))
	local result = {}
	for k,v in pairs(luup.devices) do
		if( getParent(k)==parent) then
			result[#result+1] = func(k, param)
		end
	end
	return result
end

------------------------------------------------
-- HOUSE MODE
------------------------------------------------
-- 1 = Home
-- 2 = Away
-- 3 = Night
-- 4 = Vacation
local HModes = { "Home", "Away", "Night", "Vacation" ,"Unknown" }

local function setHouseMode( newmode )
	debug(string.format("HouseMode, setHouseMode( %s )",newmode))
	newmode = tonumber(newmode)
	if (newmode>=1) and (newmode<=4) then
		debug("SetHouseMode to "..newmode)
		luup.call_action('urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode=newmode }, 0)
	end
end

local function getMode()
	debug("HouseMode, getMode()")
	-- local url_req = "http://" .. getIP() .. ":3480/data_request?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode"
	local url_req = "http://127.0.0.1".. port3480 .."/data_request?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode"
	local req_status, req_result = luup.inet.wget(url_req)
	-- ISSUE WITH THIS CODE=> ONLY WORKS WITHIN GLOBAL SCOPE LUA, not in PLUGIN context
	-- debug("calling getMode()...")
	-- local req_result =  luup.attr_get("Mode")
	-- debug("getMode() = "..req_result)
	req_result = tonumber( req_result or (#HModes+1) )
	log(string.format("HouseMode, getMode() returns: %s, %s",req_result or "", HModes[req_result]))
	return req_result , HModes[req_result]
end

------------------------------------------------
-- Get user_data
------------------------------------------------
local function getFirstUserData()
	-- local url_req = "http://127.0.0.1:3480/data_request?id=user_data&output_format=json"
	-- local req_status, req_result = luup.inet.wget(url_req)
	-- if (req_status~=0) then
		-- debug(string.format("getScriptContent(%s) failed, returns: %s",filename,req_status))
		-- return ""
	-- end
	-- return req_result
	return "{}"
end

------------------------------------------------
-- Get File ( uncompress & return content )
------------------------------------------------
local function getScriptContent( filename )
	log("getScriptContent("..filename..")")
	local url_req = "http://127.0.0.1".. port3480 .."/"..filename
	local req_status, req_result = luup.inet.wget(url_req)
	-- debug(string.format("getScriptContent(%s) returns: %s",filename,req_result))
	if (req_status~=0) then
		debug(string.format("getScriptContent(%s) failed, returns: %s",filename,req_status))
		return ""
	end
	return req_result
end


------------------------------------------------------------------------------------------------
-- Http handlers : Communication FROM ALTUI
-- http://192.168.1.5:3480/data_request?id=lr_ALTUI_Handler&command=xxx
-- recommended settings in ALTUI: PATH = /data_request?id=lr_ALTUI_Handler&mac=$M&deviceID=114
------------------------------------------------------------------------------------------------
function switch( command, actiontable)
	-- check if it is in the table, otherwise call default
	if ( actiontable[command]~=nil ) then
		return actiontable[command]
	end
	log("ALTUI_Handler:Unknown command received:"..command.." was called. Default function")
	return actiontable["default"]
end

-- WARNING: put the proper src attribute name to work with the UIManager preload check
local htmlLocalScripts = [[
	<script src="@localcdn@/jquery.min.js"></script>
	<script src="@localcdn@/lodash.min.js"></script>
	<script src="@localcdn@/backbone-min.js"></script>
	<script src="@localcdn@/popper.js"></script>
	<script src="@localcdn@/bootstrap.min.js"></script>
	<script src="@localcdn@/jquery-ui.min.js"></script>
	<script src="@localcdn@/jquery.bootgrid.min.js"></script>
	<script src="@localcdn@/joint.min.js"></script>
	<script src="@localcdn@/joint.shapes.fsa.min.js"></script>
	<script src="@localcdn@/joint.shapes.devs.min.js"></script>
	<script src="@localcdn@/spectrum.min.js"></script>
	<script src="@localcdn@/raphael-min.js"></script>
	<script src="@localcdn@/ace.js"></script>
	<script src="@localcdn@/justgage.min.js"></script>
	<script src="@localcdn@/jsapi.js"></script>
]]

local htmlAltuiScripts = [[
	<script type="text/javascript" data-src='J_ALTUI_jquery.ui.touch-punch.min.js' src="@altuipath@J_ALTUI_jquery.ui.touch-punch.min.js" ></script>
	<script type="text/javascript" data-src='J_ALTUI_utils.js' src="@altuipath@J_ALTUI_utils.js" ></script>
	<script type="text/javascript" data-src='J_ALTUI_api.js' src="@altuipath@J_ALTUI_api.js" ></script>
	<script type="text/javascript" data-src='J_ALTUI_upnp.js' src="@altuipath@J_ALTUI_upnp.js" ></script>
	<script type="text/javascript" data-src='J_ALTUI_verabox.js' src="@altuipath@J_ALTUI_verabox.js" ></script>
	<script type="text/javascript" data-src='J_ALTUI_multibox.js'  src="@altuipath@J_ALTUI_multibox.js" ></script>

	<script type='text/javascript' data-src='J_ALTUI_plugins.js' src='@altuipath@J_ALTUI_plugins.js'></script>
	<script type='text/javascript' data-src='J_ALTUI_iphone.js' src='@altuipath@J_ALTUI_iphone.js'></script>
	<script type="text/javascript" data-src='J_ALTUI_uimgr.js' src="@altuipath@J_ALTUI_uimgr.js"	></script>
]]
	-- <script src="@localcdn@/d3.min.js"></script>

-- <script type="text/javascript" src="//code.jquery.com/jquery-migrate-1.4.1.js" ></script>
-- SW compat matrix
-- jquery 1.9 jointjs 0.9.7 backbone 1.2.1 spectrum 1.8.0
-- jquery 2.2.4 jointjs 1.0.3 backbone 1.3.3 spectrum 1.8.0

-- <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jointjs/1.0.3/joint.min.js" ></script>
-- <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jointjs/1.0.3/joint.shapes.fsa.min.js"></script>
-- <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jointjs/1.0.3/joint.shapes.devs.min.js"></script>

-- %s to inject bootstrap verion
local htmlBootstrapScript = [[	
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@%s/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
]]

local htmlScripts = [[
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/@swversion@/jquery.min.js" ></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.14/lodash.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.0/backbone-min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.5/umd/popper.js" ></script>
@bootstrapscript@
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" ></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.3.1/jquery.bootgrid.min.js" defer></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/raphael/2.1.4/raphael-min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ace.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/justgage/1.2.9/justgage.min.js"></script>
	<script type="text/javascript" src='//www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["gauge","table"]}]}' >
	</script>
]]

	-- <script src="J_ALTUI_b_blockly_compressed.js" defer ></script>
	-- <script src="J_ALTUI_b_blocks_compressed.js" defer ></script>
	-- <script src="J_ALTUI_b_javascript_compressed.js" defer ></script>
	-- <script src="J_ALTUI_b_lua_compressed.js" defer ></script>

local htmlStyle = [[
	<style>
	body {	}
	</style>
]]

--https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css
--local defaultBootstrapPath = "//maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
local defaultBootstrapPath = "https://cdn.jsdelivr.net/npm/bootstrap@%s/dist/css/bootstrap.min.css"

-- WARNING: put the proper class name to work with the UIManager preload check. '.' are replaced by '_'
local htmlLocalCSSlinks = [[
	<link rel="stylesheet" href="@localcdn@/jquery-ui.css">
	<link rel="stylesheet" href="@localcdn@/font-awesome.min.css" >
	<link rel="stylesheet" href="@localcdn@/bootstrap.min.css">
	<link rel="stylesheet" href="@localcdn@/jquery.bootgrid.min.css">
	<link rel="stylesheet" type="text/css" href="@localcdn@/spectrum.min.css">
	<link class="joint_css" rel="stylesheet" type="text/css" href="@localcdn@/joint.css">
	<link class="altui-theme" rel="stylesheet" href="@ThemeCSS@">
]]

local htmlCSSlinks = [[
	<link rel="stylesheet" type="text/css" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" >
	<link rel="stylesheet" type="text/css" href="@localbootstrap@">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-bootgrid/1.3.1/jquery.bootgrid.min.css">
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css">
	<link class="altui-theme" rel="stylesheet" href="@ThemeCSS@">
]]

local htmlLayout = [[
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="icon" type="image/png" href="@favicon@" />
	<!-- Latest compiled and minified CSS -->

	@csslinks@
	@style@
	<title></title>
</head>

<body role="document">
	<script type='text/javascript' >
		// BROWSER DETECTION
		var userAgent = navigator.userAgent.toLowerCase();
		var mybrowser = {
		   version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],
		   chrome: /chrome/.test( userAgent ),
		   safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
		   opera: /opera/.test( userAgent ),
		   msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		   mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
		};

		if ( (mybrowser['msie']==true)	&& (parseFloat(mybrowser['version']) <=9))
		{
			document.writeln('<span>Sorry !! Your Browser is too old, you need to upgrade to a recent browser supporting <b>HTML5</b> like:<ul><li>Chrome</li><li>Firefox</li><li>IE 10,11,...</li></ul></span>');
		}

		function _executeFunctionByName(functionName, context , device, extraparam) {
			var namespaces = functionName.split(".");
			var func = namespaces.pop();
			for (var i = 0; i < namespaces.length; i++) {
				context = context[ namespaces[i] ];
			}
			return context[func].call(context, device, extraparam);
		};

		function _loadStyle(styleFunctionName) {
			var title = document.getElementsByTagName('title')[0];
			var style = document.createElement('style');
			style.type = 'text/css';
			var css = _executeFunctionByName(styleFunctionName, window);
			style.appendChild(document.createTextNode(css));
			title.parentNode.insertBefore(style,title);

		};
	</script>

	<!-- Bootstrap core JavaScript	  ================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<!-- Latest compiled and minified JavaScript -->
	@mandatory_scripts@
	@altui_scripts@
	
	<!-- <script src="J_ALTUI_jquery.ui.touch-punch.min.js"></script> -->
	@optional_scripts@
	<script type='text/javascript' defer >
	<!--
		if (google) {
			google.setOnLoadCallback(function(){   /*console.log('google loaded')*/ });
		}
		var g_ALTUI = {
			 g_MyDeviceID : @mydeviceid@,
			 g_ExtraController : '@extracontroller@',
			 g_svnVersion : '@svnVersion@',
			 g_FirstUserData : @firstuserdata@,
			 g_jspath : '',
			 g_CustomTheme : '@ThemeCSS@',
			 g_CustomBackground : '@BackgroundImg@',
			 g_CustomImagePath : '@ImagePath@',
			 g_Options : '@ServerOptions@',
			 g_CtrlOptions : '@ctrloptions@',
			 g_DeviceTypes :  JSON.parse('@devicetypes@'),
			 g_CtrlTimeout : '@ctrltimeout@',
			 //g_CustomPages : @custompages@,
			 //g_Workflows : @workflows@
		}
		g_ALTUI.g_OrgTheme = g_ALTUI.g_CustomTheme;

		_loadStyle('ALTUI_PluginDisplays.getStyle')
		_loadStyle('ALTUI_IPhoneLocator.getStyle')

		// -->
	</script>
	<div id="wrap"></div>
	<footer class="bg-light" id="footer"><hr class="m-0"><p class="text-center m-1"><small id="altui-footer"><span class="bg-danger">Waiting Initial Data</span></small></p><span id="debug"></span></footer>
</body>
</html>
]]


------------------------------------------------
-- Watch Management
------------------------------------------------

-- service#variable#deviceid#sceneid#lua_expr#blockly xml;service#variable#deviceid#sceneid#lua_expr#blockly xml
local function setWatchParams(service,variable,deviceid,sceneid,lua,xml)
	return string.format("%s#%s#%s#%s#%s#%s",service,variable,deviceid,sceneid,lua,xml or '')
end

local function getWatchParams(str)
	local params = str:altui_split("#")
	return params[1],params[2],params[3],tonumber(params[4]),params[5],params[6]
end

local function setRemoteWatchParams(service,variable,devid,ctrlid,ipaddr)
	return string.format("%s#%s#%s#%s#%s",service,variable,devid,ctrlid,ipaddr)
end

--local service,variable,devid,ctrlid,ipaddr = getRemoteWatchParams(str)
local function getRemoteWatchParams(str)
	local params = str:altui_split("#")
	return params[1],params[2],params[3],params[4],params[5]
end

-- service#variable#deviceid#provider#data line which is a template sprintf string for params
-- urn:micasaverde-com:serviceId:SceneController1#LastSceneID#208#thingspeak#61186#U1F7T31MHB5O8HZI#U1F7T31MHB5O8HZI#0#graphic url
local function setPushParams(service,variable,deviceid,provider,providerparams)
	-- channelid,readkey,writekey,field,url
	return string.format("%s#%s#%s#%s#%s",service,variable,deviceid,provider,table.concat(providerparams,"#"))
end

local function getPushParams(str)
	local params = str:altui_split("#")
	local providerparams={}
	for i=5,#params do
		providerparams[i-4]=params[i]
	end
	return params[1],params[2],params[3],params[4],providerparams
end

local function saveRemoteWatch(lul_device,service,variable,devid,ctrlid,ipaddr)
	debug(string.format("saveRemoteWatch(%s,%s,%s,%s,%s,%s)",lul_device,service,variable,devid,ctrlid,ipaddr))
	local watchline = setRemoteWatchParams(service,variable,devid,ctrlid,ipaddr)
	local variableWatch = getSetVariable(ALTUI_SERVICE, "RemoteVariablesToWatch", lul_device, "")
	local bFound=false;
	for k,v	 in pairs(variableWatch:altui_split(';')) do
		if (watchline==v) then
			bFound = true;
		end
	end
	if (bFound==false) then
		variableWatch = watchline .. ";" .. variableWatch
		luup.variable_set(ALTUI_SERVICE, "RemoteVariablesToWatch", variableWatch, lul_device)
	end
end

local function setRemoteWatch(service,variable,devid,ctrlid,ipaddr)
	debug(string.format("setRemoteWatch(%s,%s,%s,%s,%s)",service,variable,devid,ctrlid,ipaddr))
	-- devid = tonumber(devid)
	if (remoteWatches[devid]==nil) then
		remoteWatches[devid]={}
	end
	if (remoteWatches[devid][service]==nil) then
		remoteWatches[devid][service]={}
	end
	if (remoteWatches[devid][service][variable]==nil) then
		remoteWatches[devid][service][variable]={
			["ctrlid"] = ctrlid,
			["ipaddr"] = ipaddr
		}
		return true
	end
	return false
end

-- http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=addRemoteWatch&device=112&variable=Status&service=urn:upnp-org:serviceId:SwitchPower1&data=192.168.1.16
-- http://192.168.1.5/port_3480/data_request?id=lr_ALTUI_Handler&command=addRemoteWatch&device=42&variable=Status&service=urn:upnp-org:serviceId:SwitchPower1&data=192.168.1.16
local function delRemoteWatch(lul_device,service,variable,devid,ctrlid,ipaddr)
	debug(string.format("delRemoteWatch(%s,%s,%s,%s,%s,%s)",lul_device,service,variable,devid,ctrlid,ipaddr))
	local watchline = setRemoteWatchParams(service,variable,devid,ctrlid,ipaddr)
	local variableWatch = getSetVariable(ALTUI_SERVICE, "RemoteVariablesToWatch", lul_device, "")
	local toKeep = {}
	for k,v	 in pairs(variableWatch:altui_split(';')) do
		if (v ~= watchline) then
			table.insert(toKeep,v)
		end
	end
	luup.variable_set(ALTUI_SERVICE, "RemoteVariablesToWatch", table.concat(toKeep,";"), lul_device)
	return "ok"
end

local function addRemoteWatch(lul_device,service,variable,devid,ctrlid,ipaddr)
	debug(string.format("addRemoteWatch(%s,%s,%s,%s,%s,%s)",lul_device,service,variable,devid,ctrlid,ipaddr))
	if (setRemoteWatch(service,variable,devid,ctrlid,ipaddr)==true) then
		local parts = devid:altui_split("-");
		luup.variable_watch("remoteVariableWatchCallback", service,variable,tonumber(parts[2]))
		saveRemoteWatch(lul_device,service,variable,devid,ctrlid,ipaddr)
	else
		debug("Ignoring duplicate remote watch")
	end
	return "ok"
end

function remoteVariableWatchCallback(lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
	debug(string.format("remoteVariableWatchCallback(%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable, lul_value_old, lul_value_new))
	debug(string.format("remoteWatches:%s",json.encode(remoteWatches)))
	local altuiid = "0-"..lul_device
	local watch = remoteWatches[altuiid][lul_service][lul_variable]
	if (watch~=nil) then
		local url = string.format("http://%s%s/data_request?id=lr_ALTUI_Handler&command=remoteWatchCB&service=%s&variable=%s&device=%d&old=%s&new=%s&ctrlid=%s",
			watch["ipaddr"],
			port3480,
			lul_service,
			lul_variable,
			lul_device,
			lul_value_old,
			lul_value_new,
			watch["ctrlid"]
		)
		debug(string.format("calling url:%s",url))
		local httpcode,data = luup.inet.wget(url,10)
		if (httpcode~=0) then
			error(string.format("failed to connect to url:%s, http.request returned %d", url,httpcode))
			return 0
		end
		debug(string.format("success httpcode:%s data:%s",httpcode,data))
		return 1
	else
		warning("ignoring watch CB because of unknown watch")
	end
	return 0
end

function watchTimerCB(lul_data)
	debug(string.format("watchTimerCB(%s)",lul_data))
	local tbl = lul_data:altui_split('#')

	-- if the timer was cancelled,	ignore
	local watch = findWatch( tbl[1], tbl[2], tbl[3] )
	local expr = tbl[4]
	local tbl_expr = watch['Expressions'][expr]
	for k,v in pairs(watch['Expressions'][expr]) do
		if (v["PendingTimer"] == nil) then
			warning(string.format("Ignoring timer callback, timer was cancelled for index:%s expression %s",tostring(k),expr))
		else
			-- otherwise cancel it now
			watch['Expressions'][expr][k]["PendingTimer"] = nil
			-- if we are here , nobody cancelled the timer so it is assumed the condition is true
			local scene = watch['Expressions'][expr][k]["SceneID"]
			local res = run_scene(scene)
			if (res==-1) then
				error(string.format("Failed to run the scene %s",scene))
			end
		end
	end
	debug(string.format("updated watches %s",json.encode(registeredWatches)))
end

function myALTUI_LuaRunHandler(lul_request, lul_parameters, lul_outputformat)
	-- local oldlog =	_G.log
	-- _G.log = luup.log
	-- local olddebug = _G.debug
	-- _G.debug = luup.log
	-- local oldwarning = _G.warning
	-- _G.warning = luup.log

	-- log('myALTUI_LuaRunHandler: request is: '..tostring(lul_request))
	-- log('myALTUI_LuaRunHandler: parameters is: '..json.encode(lul_parameters))
	-- log('myALTUI_LuaRunHandler: outputformat is: '..json.encode(lul_outputformat))
	-- debug("hostname="..hostname)
	-- if (hostname=="") then
		-- hostname = getIP()
		-- debug("now hostname="..hostname)
	-- end
	-- local lua = lul_parameters["lua"]
	-- code,result,output = runLua(deviceID,lua)
	-- local res = string.format("%d||%s||%s",code,json.encode(result),output);
	-- _G.log = oldlog
	-- _G.debug = olddebug
	-- _G.warning = oldwarning
	res="1||all is ok||all is ok"
	return res, "text/plain"
end

local function _helperGoogleScript(url,method,data)
	debug(string.format("ALTUI: _helperGoogleScript (%s,%s)	 data:%s",method,url,data))
	-- local data = "contents="..plugin
	local response_body = {}
	local commonheaders = {
			["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8",
			["Content-Length"] = data:len(),
			["User-agent"] = "Find iPhone/1.3 MeKit (iPad: iPhone OS/4.2.1)",
			["Connection"]= "keep-alive"
		}
	local response, status, headers = https.request{
		method=method,
		url=url,
		headers = commonheaders,
		source = ltn12.source.string(data),
		sink = ltn12.sink.table(response_body)
	}
	if (response==1) then
		local completestring = table.concat(response_body)
		debug(string.format("ALTUI: Succeed to %s to %s	 result=%s",method,url,completestring))
		if (status==302) then
			-- redirect
			debug( string.format("ALTUI: _helperGoogleScript 302, headers= %s", json.encode(headers) ))
			local url = headers["location"]
			local httpcode,data = luup.inet.wget(url,15)
			return data
		end
		return completestring
	else
		debug(string.format("ALTUI: Failed to POST to %s",url))
	end
	return "error"
end

local function _helperGoogleAuthCallback(url,lul_device)
	debug(string.format("ALTUI: _helperGoogleAuthCallback (%s)",url))
	local data = ""
	local response_body = {}
	local response, status, headers = https.request{
		method="GET",
		url=url,
		source = ltn12.source.string(data),
		sink = ltn12.sink.table(response_body)
	}
	if (response==1) then
		local content = table.concat(response_body)
		debug( string.format("ALTUI: GoogleAuthCallback %s returned %s ", url , content ))
		if (status==302) then
			-- redirect
			debug( string.format("ALTUI: got 302, headers= %s", json.encode(headers) ))
			local url = headers["location"]
			return _helperGoogleAuthCallback(url,lul_device)
		end
		local obj = json.decode(content)
		if ( (obj==nil) or (obj.error ~= nil) ) then
			luup.variable_set(ALTUI_SERVICE, "GoogleLastError", content or "" , tonumber(lul_device))
		else
			luup.variable_set(ALTUI_SERVICE, "GoogleLastError", "" , tonumber(lul_device))
			luup.variable_set(ALTUI_SERVICE, "GoogleAuthToken", content or "", tonumber(lul_device))
		end
		return content
	else
		debug( string.format("ALTUI: GoogleAuthCallback failed to call %s",url))
	end
	return ""
end

local function GoogleAuthCallback(command,lul_device)
	debug("ALTUI: GoogleAuthCallback : "..command)
	local url = ""
	if (command=="access") then
		local device_code = getSetVariable(ALTUI_SERVICE, "GoogleDeviceCode", lul_device, "")
		url = string.format("https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?code=%s",device_code)
	elseif (command=="refresh") then
		local str = getSetVariable(ALTUI_SERVICE, "GoogleAuthToken",  tonumber(lul_device),"")
		local refresh_token = ""
		if (str ~="") then
			refresh_token = (json.decode(str)).refresh_token or ""
		end
		url = string.format("https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?refresh_token=%s",refresh_token)
	end
	return _helperGoogleAuthCallback(url,lul_device)
end

function refreshWorkflows(lul_device)
	debug('refreshWorkflows: for '.. lul_device)
	lul_device = tonumber(lul_device)
	Workflows = getWorkflowsDescr(lul_device) 
	return true
end

function myALTUI_Handler(lul_request, lul_parameters, lul_outputformat)
	debug('myALTUI_Handler: request is: '..tostring(lul_request))
	debug('myALTUI_Handler: parameters is: '..json.encode(lul_parameters))
	-- debug('ALTUI_Handler: outputformat is: '..json.encode(lul_outputformat))
	local lul_html = "";	-- empty return by default
	local mime_type = "";
	local command
	
	-- debug("hostname="..hostname)
	if (hostname=="") then
		hostname = getIP()
		debug("now hostname="..hostname)
	end

	-- find a parameter called "command"
	if ( lul_parameters["command"] ~= nil ) then
		command =lul_parameters["command"]
	else
		debug("ALTUI_Handler:no command specified, taking default")
		command ="default"
	end

	local deviceID = this_device or tonumber(lul_parameters["DeviceNum"] or findALTUIDevice() )

	-- switch table
	local action = {
		["home"] =
			function(params)
				local result = luup.variable_get(ALTUI_SERVICE, "PluginConfig", deviceID)
				local tbl = json.decode(result)
				tbl ["info"] = {
					["controllerType"] = "V",
					["ui7Check"] = luup.variable_get(ALTUI_SERVICE, "UI7Check", deviceID) or "",
					["debug"] = DEBUG_MODE,
					["workflow"] = WFLOW_MODE,
					["PluginVersion"] = luup.variable_get(ALTUI_SERVICE, "Version", deviceID) or "",
					["RemoteAccess"] = luup.variable_get(ALTUI_SERVICE, "RemoteAccess", deviceID) or ""
				}

				-- preload necessary scripts : optimization for remote access
				-- without this, ALTUI just dynamically load the script but it seems to take long time sometime
				local scripts = {}
				local loaded = {}
				local styles = {}
				local idx= 1
				-- scripts[idx] = "J_ALTUI_plugins.js"
				-- loaded[scripts[idx]]=true
				-- idx = idx+1
				local lang=""
				if ( (lul_parameters["lang"]~=nil) and (lul_parameters["lang"]~="en") ) then
					lang = string.sub( (lul_parameters["lang"].."	 "),1,2)
					scripts[idx] = "J_ALTUI_loc_"..lang..".js"
					loaded[scripts[idx]]=true
					idx = idx+1
				end

				--------------------------------
				-- preload scripts of pluigins
				--------------------------------
				-- for k,v in pairs(tbl) do
					-- if (v["ScriptFile"]	~= nil) then
						-- if (loaded[v["ScriptFile"]]~=true)  then
							-- scripts[idx] = v["ScriptFile"]
							-- loaded[v["ScriptFile"]]=true
							-- idx = idx + 1
						-- end
						-- if (v["StyleFunc"]  ~= nil) then
							-- styles[v["ScriptFile"]] = v["StyleFunc"]
						-- end
					-- end
				-- end

				if (lang=="") then
					lang="en"
				end
				--------------------------------
				-- preload scripts of ALTUI
				--------------------------------
				-- for k,v in pairs({"J_ALTUI_b_blockly_compressed.js","J_ALTUI_b_blocks_compressed.js","J_ALTUI_b_"..lang..".js","J_ALTUI_b_javascript_compressed.js","J_ALTUI_b_lua_compressed.js"}) do
					-- scripts[idx] = v
					-- loaded[scripts[idx]]=true
					-- idx = idx+1
				-- end

				local optional_scripts=""
				for i = 1,#scripts do
					local str = getScriptContent(scripts[i])
					if (styles[scripts[i]]	~= nil) then
						str = str .. "_loadStyle('"..styles[scripts[i]].."');"
					end
					optional_scripts = optional_scripts	 .. string.format(
						"<script type='text/javascript' data-src='%s' >%s</script>",
						scripts[i],
						"//<!-- \n".. str .. "\n// // -->\n"
						)
				end
				-- get pages
				-- local pagelist = getDataFor( deviceID, "CustomPages" ) or "{}"
				-- if (pagelist=="[]") then
					-- pagelist="{}"
				-- end
				-- local custompages_tbl = json.decode( pagelist )
				-- local result_tbl ={}
				-- for k,v in pairs(custompages_tbl) do
					-- local data = getDataFor( deviceID, v )
					-- table.insert(  result_tbl , data )
				-- end

				-- local custompages = luup.variable_get(ALTUI_SERVICE, "CustomPages", deviceID) or "[]"
				-- custompages = string.gsub(custompages,"'","\\x27")
				-- custompages = string.gsub(custompages,"\"","\\x22")
				local serverOptions= getSetVariable(ALTUI_SERVICE, "ServerOptions", deviceID, "")
				local localcdn = getSetVariable(ALTUI_SERVICE, "LocalCDN", deviceID, "")
				local altuipath = getSetVariable(ALTUI_SERVICE, "ALTUIPath", deviceID, "")
				local tmp_swversion = getSetVariable(ALTUI_SERVICE, "SWVersion", deviceID, SWVERSION.."/"..BOOTSTRAPVERSION)
				local parts = tmp_swversion:altui_split("/")
				local swversion = parts[1] or SWVERSION
				local bootstrapversion  = parts[2] or BOOTSTRAPVERSION
				local favicon = getSetVariable(ALTUI_SERVICE, "FavIcon", deviceID, "/favicon.ico")
				local ctrltimeout = getSetVariable(ALTUI_SERVICE, "ControlTimeout", lul_device, DEFAULT_TIMEOUT)
				local localbootstrap = getSetVariable(ALTUI_SERVICE, "LocalBootstrap", deviceID, "")
				if (localbootstrap == "") then
					localbootstrap=string.format(defaultBootstrapPath,bootstrapversion)
				end
				if (localcdn=="~") then
					localcdn=""
				end
				-- if (localcdn ~= "") then
					-- altuipath = localcdn .. "/"
				-- end
				local variables={}
				variables["hostname"] = hostname
				variables["localcdn"] = localcdn
				variables["altuipath"] = altuipath
				variables["swversion"] = swversion
				variables["bootstrapscript"] = string.format(htmlBootstrapScript,bootstrapversion)
				variables["favicon"] = favicon
				variables["ctrltimeout"] = ctrltimeout
				variables["localbootstrap"] = localbootstrap
				variables["devicetypes"] = json.encode(tbl)
				-- variables["custompages"] = "["..table.concat(result_tbl, ",").."]"
				-- variables["workflows"] = json.encode(Workflows)
				variables["ThemeCSS"] = (luup.variable_get(ALTUI_SERVICE, "ThemeCSS", deviceID) or ""):trim()
				variables["BackgroundImg"] = (luup.variable_get(ALTUI_SERVICE, "BackgroundImg", deviceID) or ""):trim()
				variables["ImagePath"] = (luup.variable_get(ALTUI_SERVICE, "ImagePath", deviceID) or ""):trim()
				variables["ServerOptions"] = serverOptions
				variables["style"] = htmlStyle
				variables["mydeviceid"] = deviceID
				variables["svnVersion"] = luup.attr_get("SvnVersion",0)
				variables["extracontroller"] = getSetVariable(ALTUI_SERVICE, "ExtraController", deviceID, "")
				variables["ctrloptions"] = getSetVariable(ALTUI_SERVICE, "CtrlOptions", deviceID, "")
				-- variables["firstuserdata"] = "{}"
				variables["firstuserdata"] = getFirstUserData()	-- ( json.encode( getFirstUserData() )	-- :gsub("'", "\'") )
				if (localcdn ~= "") then
					variables["csslinks"] = htmlLocalCSSlinks:template(variables)
					variables["mandatory_scripts"] = htmlLocalScripts:template(variables)
					variables["altui_scripts"] = htmlAltuiScripts:template(variables)
				else
					variables["csslinks"] = htmlCSSlinks:template(variables)
					variables["mandatory_scripts"] = htmlScripts:template(variables)
					variables["altui_scripts"] = htmlAltuiScripts:template(variables)
				end
				-- " becomes \x22
				variables["optional_scripts"] = optional_scripts
				return htmlLayout:template(variables),"text/html"
			end,
		["get_device_code"] =
			function(params)
				local data = "client_id=304512464610-0ijp8qtk0jobgugnp5ip7mgle8vm5lm0.apps.googleusercontent.com&scope=email+profile"
				local response_body = {}
				local commonheaders = {
						["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8",
						["Content-Length"] = data:len(),
						["User-agent"] = "Find iPhone/1.3 MeKit (iPad: iPhone OS/4.2.1)",
						["Connection"]= "keep-alive"
					}
				local response, status, headers = https.request{
					method="POST",
					url="https://accounts.google.com/o/oauth2/device/code",
					headers = commonheaders,
					source = ltn12.source.string(data),
					sink = ltn12.sink.table(response_body)
				}
				if (response==1) then
					-- {
					  -- "verification_url" : "https://www.google.com/device",
					  -- "expires_in" : 1800,
					  -- "interval" : 5,
					  -- "device_code" : "CMND-GVYU4/cvM-PXrxAxzQG8Fsbs2N_pP2adMrS6dJob8C3W7MMc0",
					  -- "user_code" : "CMND-GVYU"
					-- }
					local completestring = table.concat(response_body)
					debug(string.format("ALTUI: Succeed to POST to https://accounts.google.com/o/oauth2/device/code , result=%s",completestring))
					local obj = json.decode(completestring)
					setVariableIfChanged(ALTUI_SERVICE, "GoogleDeviceCode", obj.device_code, deviceID)
					setVariableIfChanged(ALTUI_SERVICE, "GoogleUserCode", obj.user_code, deviceID)
					return completestring, "text/plain"
				else
					debug(string.format("ALTUI: Failed to POST to https://accounts.google.com/o/oauth2/device/code"))
				end
			end,
		["get_auth_token"] =
			function(params)
				return GoogleAuthCallback( "access", deviceID), "text/plain"
			end,
		["refresh_auth_token"] =
			function(params)
				return GoogleAuthCallback( "refresh", deviceID), "text/plain"
			end,
		["update_plugin"] =
			function(params)
				local plugin = lul_parameters["plugin"]
				plugin = modurl.unescape( plugin)
				local str = getSetVariable(ALTUI_SERVICE, "GoogleAuthToken",  tonumber(deviceID),"")
				local access_token=""
				if (str~="") then
					access_token = (json.decode(str)).access_token or ""
				end
				local url = "https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?command=update&access_token="..access_token
				return _helperGoogleScript(url,"POST",plugin), "text/plain"
			end,
		["create_plugin"] =
			function(params)
				local plugin = lul_parameters["plugin"]
				plugin = modurl.unescape( plugin)
				local str = getSetVariable(ALTUI_SERVICE, "GoogleAuthToken",  tonumber(deviceID),"")
				local access_token=""
				if (str~="") then
					access_token = (json.decode(str)).access_token or ""
				end
				local url = "https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?command=create&access_token="..access_token
				return _helperGoogleScript(url,"POST",plugin), "text/plain"
			end,
		["update_plugin_review"] =
			function(params)
				local data = {
					["plugin_id"]= lul_parameters["plugin_id"],
					["comment"]= modurl.unescape(( lul_parameters["comment"] or "" ):gsub("+", " ")),  --  + seems not to be decoded by url module
					["rate"]= lul_parameters["rate"],
					["user_name"]= modurl.unescape( lul_parameters["user_name"] or "")
				}
				data = json.encode(data)
				local str = getSetVariable(ALTUI_SERVICE, "GoogleAuthToken",  tonumber(deviceID),"")
				local access_token=""
				if (str~="") then
					access_token = (json.decode(str)).access_token or ""
				end
				-- PROD
				local url = "https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?command=put_review&access_token="..access_token
				-- DEV
				-- local url = "https://script.google.com/macros/s/AKfycbxFIcNe0GuscRhsqKfC8dDSjBuguXed-WFN-crInGI4/dev?command=set_review&access_token="..access_token
				return _helperGoogleScript(url,"POST",data), "text/plain"
			end,
		["get_authorized_plugins"] =
			function(params)
				local str = getSetVariable(ALTUI_SERVICE, "GoogleAuthToken",  tonumber(deviceID),"")
				local access_token=""
				if (str~="") then
					access_token = (json.decode(str)).access_token or ""
				end
				local url = "https://script.google.com/macros/s/AKfycbz1A9_ONPBBsJuIk5zyLl9VrmOejiSkcAT6R_MBB3ItSJ-eVrr6/exec?command=list&access_token="..access_token
				return _helperGoogleScript(url,"GET",""), "text/plain"
			end,
		["save_data"] =
			function(params)
				local name = lul_parameters["name"]
				local npage = lul_parameters["npage"]
				local data = lul_parameters["mydata"]
				local handle = lul_parameters["handle"]
				local prefix = lul_parameters["prefix"] or "Data"
				debug(string.format("ALTUI_Handler: save_data( name:%s npage:%s handle:%s)",name,npage,handle or ''))
				debug(string.format("ALTUI_Handler: save_data data: %s",json.encode(data)))

				prefix = prefix .. "_"
				if (tonumber(npage)==0) then
					handle = os.time()	-- vague possibility of conflict but not realistic
					handle = tostring(handle)
					ReceivedData[handle] = {
						["name"] = name,
						["pages"] = {},
					}
				end
				debug(string.format("ALTUI_Handler: ReceivedData:%s",json.encode(ReceivedData)))
				if (handle==nil) or (ReceivedData[handle]==nil) then
					return "-1", "text/plain"
				end

				local variablename = prefix..name.."_"..npage
				if (data=="") or (data==nil) then
					-- debug(string.format("ALTUI_Handler: save_data( ) - Empty data",name,npage))
					ReceivedData[handle]["pages"][0] = ""
					-- luup.variable_set(ALTUI_SERVICE, variablename, " ", deviceID) -- avoid empty str as it seems to delete variable
				else
					-- debug(string.format("ALTUI_Handler: save_data( ) - Not Empty data",name,npage))
					data = modurl.unescape( data )
					-- debug(string.format("ALTUI_Handler: save_data( ) - url decoded",name,npage))
					ReceivedData[handle]["pages"][0] = ( ReceivedData[handle]["pages"][0] or "" ) .. data
					-- luup.variable_set(ALTUI_SERVICE, variablename, data, deviceID)
					-- debug(string.format("ALTUI_Handler: save_data( ) - returns:%s",data))
				end
				return handle, "text/plain"
			end,
		["clear_data"] =
			function(params)
				local prefix = lul_parameters["prefix"] or "Data"
				local name = lul_parameters["name"]
				local npage = lul_parameters["npage"]
				local handle = lul_parameters["handle"]
				if (handle==nil) or (ReceivedData[handle]==nil) then
					return "-1", "text/plain"
				end
				debug(string.format("ALTUI_Handler: clear_data( name:%s npage:%s handle:%s)",name,npage,handle or ''))
				debug(string.format("ALTUI_Handler: ReceivedData:%s",json.encode(ReceivedData)))

				prefix = prefix .. "_"
				local variablename = prefix..name.."_0"

				-- now save the received data
				-- local lzw = compress.new "LZW2"
				local curpage = 0
				local len1 = ReceivedData[handle]["pages"][curpage]:len()
				local compressed_data = ReceivedData[handle]["pages"][curpage]
				local len2 = len1
				if (len1 > 2000 ) and (bUseCompress==true) then
					compressed_data = lzw.encode( ReceivedData[handle]["pages"][curpage] )
					len2 = compressed_data:len()
					debug(string.format("ALTUI_Handler: compression len1:%d len2:%d rate:%f",len1,len2,len2/len1))
				end

				-- save and clear the handle
				setDataFor( deviceID,name,prefix,compressed_data )
				ReceivedData[handle]["pages"][0] = ""
				ReceivedData[handle] = nil
				debug(string.format("ALTUI_Handler: After Clearing ReceivedData:%s",json.encode(ReceivedData)))

				return "0", "text/plain"
			end,
		-- ["run_lua"] =
			-- function(params)
				-- local lua = lul_parameters["lua"]
				-- code,result,output = runLua(deviceID,lua)
				-- local res = string.format("%d||%s||%s",code,json.encode(result),output);
				-- return res, "text/plain"
			-- end,
		["proxysoap"] =
			function(params)
				local newUrl = lul_parameters["newUrl"]
				local soapaction = lul_parameters["action"]
				local envelop= lul_parameters["envelop"]
				local body = lul_parameters["body"]
				code,result = proxySoap(deviceID,newUrl,soapaction,envelop,body)
				local res = string.format("%d,%s",code,result);
				return res, "text/plain"
			end,
		["proxyget"] =
			function(params)
				local newUrl = lul_parameters["newUrl"]
				local resultName = lul_parameters["resultName"]
				code,result = proxyGet(deviceID,newUrl,resultName)
				local res = string.format("%d,%s",code,result);
				return res, "text/plain"
			end,
		["getDataProviders"] =
			function(params)	-- return the data providers database in JSON
				debug(string.format("DataProviders:%s",json.encode(DataProviders)))
				return	json.encode(DataProviders), "application/json"
			end,
		["getWorkflowsStatus"] =
			function(params)	-- return the data providers database in JSON
				local timers = getSetVariable(ALTUI_SERVICE, "Timers", deviceID, "")
				return	json.encode( {states=WorkflowsActiveState,bags=WorkflowsVariableBag,timers=json.decode(timers)} ), "application/json"
			end,
		["getWorkflowsBag"] =
			function(params)	-- return the data providers database in JSON
				return	json.encode(WorkflowsVariableBag), "application/json"
			end,
		["getWorkflows"] =
			function(params)	
				--Workflows = getWorkflowsDescr(lul_device) -- this hangs lua,  too many thread probably at this point.
				return	json.encode(Workflows), "application/json"
			end,
		["refreshWorkflows"] =
			function(params)	
				local result = luup.call_delay("refreshWorkflows",1, deviceID)
				--Workflows = getWorkflowsDescr(lul_device) -- this hangs lua,  too many thread probably at this point.
				return	json.encode( (result==0) and "success" or "failure" ), "application/json"
			end,
		["getCustomPages"]=
			function(params)
				local pagelist = getDataFor( deviceID, "CustomPages" ) or "{}"
				if (pagelist=="[]") then
					pagelist="{}"
				end
				local custompages_tbl = json.decode( pagelist )
				local result_tbl ={}
				for k,v in pairs(custompages_tbl) do
					local data = getDataFor( deviceID, v )
					table.insert(  result_tbl , data )
				end
				return	"["..table.concat(result_tbl, ",").."]", "application/json"
			end,
		["datapush"] =
			function(params)	-- return the data providers database in JSON
				debug(string.format("Data Push Callback:%s",json.encode(lul_parameters)))
				return "ok", "text/plain"
			end,
		["delWatch"] =
			function(params)	-- primary controller beeing called to set a watch
				local providerparams = json.decode(lul_parameters["providerparams"])
				local res = delWatch(
					deviceID,
					lul_parameters["service"], lul_parameters["variable"], lul_parameters["device"],
					tonumber(lul_parameters["scene"]), lul_parameters["expression"], lul_parameters["xml"],
					lul_parameters["provider"], providerparams )
				return res, "text/plain"
			end,
		["addWatch"] =
			function(params)	-- primary controller beeing called to set a watch
				local providerparams = json.decode(lul_parameters["providerparams"])
				local res = addWatch(
					deviceID,
					lul_parameters["service"], lul_parameters["variable"], lul_parameters["device"],
					tonumber(lul_parameters["scene"]), lul_parameters["expression"], lul_parameters["xml"],
					lul_parameters["provider"],	 providerparams )
					--lul_parameters["channelid"], lul_parameters["readkey"], lul_parameters["writekey"], lul_parameters["field"], lul_parameters["graphicurl"]
				return res, "text/plain"
			end,
		["getWatchDB"] =
			function(params)	-- primary controller beeing called to set a watch
				return json.encode(registeredWatches), "application/json"
			end,
		["addRemoteWatch"] =
			function(params)	-- primary controller calling the secondary one to set a watch
				local device = "0-"..lul_parameters["device"]	-- we receive a VERA device ID, we make a ALTUI ID
				local service = lul_parameters["service"]
				local variable = lul_parameters["variable"]
				local ctrlid = lul_parameters["ctrlid"]
				local ipaddr = lul_parameters["ipaddr"]
				local res = addRemoteWatch(deviceID,service,variable,device,ctrlid,ipaddr)
				return res, "text/plain"
			end,
		["delRemoteWatch"] =
			function(params)	-- primary controller calling the secondary one to set a watch
				local device = "0-"..lul_parameters["device"]	-- we receive a VERA device ID, we make a ALTUI ID
				local service = lul_parameters["service"]
				local variable = lul_parameters["variable"]
				local ctrlid = lul_parameters["ctrlid"]
				local ipaddr = lul_parameters["ipaddr"]
				local res = delRemoteWatch(deviceID,service,variable,device,ctrlid,ipaddr)
				return res, "text/plain"
			end,
		["remoteWatchCB"] =			-- secondary controller calling back the primary controller with a watch result
			function(params)
				local lul_device = lul_parameters["device"]
				local lul_service = lul_parameters["service"]
				local lul_variable = lul_parameters["variable"]
				local lul_value_old = lul_parameters["old"]
				local lul_value_new = lul_parameters["new"]
				local ctrlid = lul_parameters["ctrlid"]
				variableWatchCallbackFromRemote(ctrlid, lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
				return "ok", "text/plain"
			end,
		["readtmp"] =	-- Command not used anymore, kept here for future in case...
			function(params)
				local filename = modurl.unescape( lul_parameters["filename"] )
				debug("opening file")
				local file = io.open(tmpprefix..filename,'r')
				local result = ''
				if file~=nil then
					result = "1,"..file:read("*a")
					file:close()
				else
					result = "0,"
				end
				debug("returning result")
				return result , "text/plain"
				-- return json.encode( {success=(response==0 or response==true), result=result} ) , "application/json"
			end,
		["oscommand"] =
			function(params)
				local resultcode=""
				local result = ""
				local command = modurl.unescape( lul_parameters["oscommand"] )
				local file = io.popen(command)
				if file then
					result = file:read("*a")
					file:close()
					resultcode = "1,"
				else
					resultcode = "0,"
				end
				-- local result = handle:read("*a")
				-- handle:close()

				-- local command = modurl.unescape( lul_parameters["oscommand"] ) .. '> /tmp/oscommand.log'
				-- local response = os.execute(command)
				-- local file = io.open('/tmp/oscommand.log','r')
				-- local result = file:read("*a")
				-- local resultcode = ""
				-- file:close()
				-- if (response==0 or response==true) then
					-- resultcode="1,"
				-- else
					-- resultcode="0,"
				-- end
				return resultcode..result , "text/plain"
			end,
				-- return json.encode( {success=(response==0 or response==true), result=result} ) , "application/json"
		["rooms"] =
			function(params)
				return json.encode( luup.rooms ) , "application/json"
			end,
		["devices"] =
			function(params)
				return json.encode( luup.devices ) , "application/json"
			end,
		["scenes"] =
			function(params)
				return json.encode( luup.scenes ), "application/json"
			end,
		["image"] =
			function(params)
				local default_img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="
				local imgpath = lul_parameters["path"]
				-- get the extension
				local i = string.find(imgpath,".",-5)
				debug("find last dot at position i="..i)
				i=i+2
				debug("i="..i)
				local extension = imgpath:sub( i )
				debug("extension="..extension)

				-- build the local IO pathname
				i= string.find(imgpath,"/cmh")
				local webpath = imgpath:sub( i )

				-- build physical file name
				local physicalpath = "/www"..webpath;
				log( string.format("extension:%s webpath:%s physicalpath:%s",extension,webpath,physicalpath) )

				-- read the file
				debug(string.format("opening %s",physicalpath))
				local file = io.open(physicalpath, "r")
				if (file==nil) then
					log("opening ".. physicalpath .." returns nil, returning default image")
					return default_img
				end
				local content = file:read("*all")
				file:close()
				debug(string.format("closing %s",physicalpath))

				-- encode in B64
				local b64 = mime.b64(content)
				debug(string.format("b64 %s",b64))
				return string.format("data:image/%s;base64,%s",extension,b64) , "image/"..extension
				--return "data:image/gif;base64,R0lGODlhEAAOALMAAOazToeHh0tLS/7LZv/0jvb29t/f3//Ub//ge8WSLf/rhf/3kdbW1mxsbP//mf///yH5BAAAAAAALAAAAAAQAA4AAARe8L1Ekyky67QZ1hLnjM5UUde0ECwLJoExKcppV0aCcGCmTIHEIUEqjgaORCMxIC6e0CcguWw6aFjsVMkkIr7g77ZKPJjPZqIyd7sJAgVGoEGv2xsBxqNgYPj/gAwXEQA7"
			end,
		["devicetypes"] =
			function(params)
				local result = luup.variable_get(ALTUI_SERVICE, "PluginConfig", deviceID)
				local tbl = json.decode(result)
				tbl ["info"] = {
					["debug"] = DEBUG_MODE,
					["ui7Check"] = luup.variable_get(ALTUI_SERVICE, "UI7Check", deviceID) or "",
					["PluginVersion"] = luup.variable_get(ALTUI_SERVICE, "Version", deviceID) or "",
					["RemoteAccess"] = luup.variable_get(ALTUI_SERVICE, "RemoteAccess", deviceID) or ""
				}
				return json.encode(tbl), "application/json"
			end,
		-- ["set_attribute"] =
			-- function(params)
				-- local attr = lul_parameters["attr"]
				-- local value = lul_parameters["value"]
				-- local devid = lul_parameters["devid"]
				-- luup.attr_set(attr , value, devid)
				-- return "ok"
			-- end,
		["default"] =
			function(params)
				return "not successful", "text/plain"
			end
	}
	-- actual call
	lul_html , mime_type = switch(command,action)(lul_parameters)
	if (command ~= "home") and (command ~= "oscommand") then
		debug(string.format("lul_html:%s",lul_html or ""))
	end
	return (lul_html or "") , mime_type
end


------------------------------------------------
-- RESET ALTUI COnfig
------------------------------------------------
local function getDefaultConfig()
	local tbl = {}
	tbl["urn:schemas-upnp-org:device:BinaryLight:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
		["StyleFunc"]="ALTUI_PluginDisplays.getStyle",
		-- ["ControlPanelFunc"]="ALTUI_PluginDisplays.drawBinLightControlPanel",
	}
	tbl["urn:schemas-micasaverde-com:device:WaterValve:1"]= {
                ["ScriptFile"]="J_ALTUI_plugins.js",
                ["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawWaterValve",
        }
	tbl["urn:schemas-micasaverde-com:device:G550Siren:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVeraSecure",
	}
	tbl["urn:schemas-micasaverde-com:device:SceneController:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawSceneController",
		-- ["ControlPanelFunc"]="ALTUI_PluginDisplays.drawBinLightControlPanel",
	}
	tbl["urn:schemas-futzle-com:device:WeMoControllee:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
		-- ["ControlPanelFunc"]="ALTUI_PluginDisplays.drawBinLightControlPanel",
	}
	tbl["urn:schemas-upnp-org:device:RGBController:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
	}
	tbl["urn:antor-fr:device:SamsungTVRemote:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawBinaryLight",
	}
	tbl["urn:schemas-micasaverde-com:device:DoorLock:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDoorLock",
	}
	tbl["urn:schemas-micasaverde-com:device:DoorSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDoorSensor",
	}
	tbl["urn:schemas-micasaverde-com:device:TemperatureSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawTempSensor",
	}
	tbl["urn:schemas-micasaverde-com:device:VOTS:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawTempSensor",
	}
	tbl["urn:schemas-upnp-org:device:Heater:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHeater",
	}
	tbl["urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawZoneThermostat",
	}
	tbl["urn:antor-fr:device:HVAC_ZoneThermostat:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawZoneThermostat",
	}
	tbl["urn:schemas-micasaverde-com:device:HumiditySensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHumidity",
	}
	tbl["urn:schemas-micasaverde-com:device:LightSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawLight",
	}
	tbl["urn:schemas-cd-jackson-com:device:DataMine:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDataMine",
	}
	tbl["urn:schemas-a-lurker-com:device:InfoViewer:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawInfoViewer",
	}
	tbl["urn:schemas-a-lurker-com:device:Paradox_IP150_wps:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.draw_Paradox_IP150_wps",
	}
	tbl["urn:demo-micasaverde-com:device:weather:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawWeather",
		["DeviceIconFunc"]="ALTUI_PluginDisplays.drawWeatherIcon",
		["FavoriteFunc"]="ALTUI_PluginDisplays.drawWeatherFavorite",
	}
	tbl["urn:schemas-upnp-org:device:DimmableLight:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmable",
	}
	tbl["urn:schemas-upnp-org:device:DimmableLight:1,D_QubinoFlushPilotWire1.json"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmableQubinoFlushPilotWire",
	}
	tbl["urn:schemas-upnp-org:device:DimmableRGBLight:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmableRGB",
	}
	tbl["urn:schemas-upnp-org:device:DimmableRGBLight:2"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmableRGB",
	}
	tbl["urn:schemas-micasaverde-com:device:PhilipsHueLuxLamp:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmable",
	}
	tbl["urn:schemas-micasaverde-com:device:PhilipsHueLamp:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDimmable",
	}
	tbl["urn:schemas-micasaverde-com:device:MotionSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMotion",
	}
	tbl["urn:schemas-futzle-com:device:WeMoSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMotion",
	}
	tbl["urn:schemas-micasaverde-com:device:SmokeSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawSmoke",
	}
	tbl["urn:schemas-micasaverde-com:device:FloodSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawFlood",
	}
	tbl["urn:schemas-micasaverde-com:device:GenericSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawGeneric",
	}
	tbl["urn:schemas-micasaverde-com:device:WindowCovering:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawWindowCover",
	}
	tbl["urn:schemas-micasaverde-com:device:PowerMeter:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPowerMeter",
	}
	tbl["urn:schemas-micasaverde-com:device:PowerMeter:2"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPowerMeter",
	}
	tbl["urn:schemas-upnp-org:device:VSwitch:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVswitch",
	}
	tbl["urn:schemas-upnp-org:device:DigitalSecurityCamera:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCamera",
		["FavoriteFunc"]="ALTUI_PluginDisplays.drawCameraTile",
	}
	tbl["urn:schemas-upnp-org:device:DigitalSecurityCamera:2"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCamera",
		["FavoriteFunc"]="ALTUI_PluginDisplays.drawCameraTile",
	}
	tbl["urn:schemas-upnp-org:device:cplus:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawCanalplus",
		["ControlPanelFunc"]="ALTUI_IPhoneLocator.drawCanaplusControlPanel"
	}
	tbl["urn:schemas-upnp-org:device:wes:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawWES",
	}
	tbl["urn:schemas-upnp-org:device:althue:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawALTHue",
	}
	tbl["urn:schemas-upnp-org:device:netmon:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawNETMON",
	}
	tbl["urn:schemas-upnp-org:device:altui:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawAltUI",
		["ControlPanelFunc"]="ALTUI_IPhoneLocator.drawAltUIControlPanel",
		["FavoriteFunc"]="ALTUI_IPhoneLocator.drawAltUIFavorite",
	}
	tbl["urn:schemas-upnp-org:device:altsonos:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawAltSonos",
	}
	tbl["urn:schemas-upnp-org:device:razb:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawRAZB",
	}
	tbl["urn:schemas-upnp-org:device:ksenia:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawKSENIA",
	}
	tbl["urn:schemas-upnp-org:device:razb:unk:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceIconFunc"]="ALTUI_PluginDisplays.drawRAZBUNKIcon",
	}
	tbl["urn:schemas-futzle-com:device:holidayvirtualswitch:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVacation",
	}
	tbl["urn:schemas-futzle-com:device:CountdownTimer:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCountDown",
		["FavoriteFunc"]="ALTUI_PluginDisplays.drawCountDownTile",
	}
	tbl["urn:schemas-upnp-org:device:IPhoneLocator:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawIPhone",
		["StyleFunc"]="ALTUI_IPhoneLocator.getStyle",
		["FavoriteFunc"]="ALTUI_IPhoneLocator.drawIPhoneFavorite",
		-- ["ControlPanelFunc"]="ALTUI_IPhoneLocator.drawControlPanel",
	}
	tbl["urn:schemas-upnp-org:device:IPX800:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawIPX"
	}
	tbl["urn:schemas-upnp-org:device:flipr:1"]= {
		["ScriptFile"]="J_ALTUI_iphone.js",
		["DeviceDrawFunc"]="ALTUI_IPhoneLocator.drawFLIPR"
	}
	tbl["urn:schemas-rts-services-com:device:ProgramLogicEG:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPLEG",
	}
	tbl["urn:schemas-utz-com:device:GCal:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawGCal"
	}
	tbl["urn:schemas-srs-com:device:GCal:3"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawGCal3"
	}
	tbl["urn:schemas-futzle-com:device:CombinationSwitch:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawCombinationSwitch"
	}
	tbl["urn:schemas-micasaverde-com:device:HouseModes:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHouseMode"
	}
	tbl["urn:schemas-rts-services-com:device:DayTime:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawDayTime"
	}
	tbl["urn:schemas-micasaverde-com:device:Sonos:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawSonos"
	}
	tbl["urn:schemas-cd-jackson-com:device:SystemMonitor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawSysMonitor"
	}
	tbl["urn:richardgreen:device:VeraAlert:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVeraAlerts"
	}
	tbl["urn:schemas-micasaverde-com:device:TempLeakSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawTempLeak"
	}
	tbl["urn:schemas-upnp-org:device:VContainer:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMultiString"
	}
	tbl["urn:schemas-futzle-com:device:UPnPProxy:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPnPProxy"
	}
	tbl["urn:schemas-rts-services-com:device:ProgramLogicTS:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawProgLogicTimerSwitch"
	}
	tbl["urn:schemas-arduino-cc:device:arduino:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMySensors"
	}
	tbl["urn:schemas-micasaverde-com:device:BarometerSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMySensorsExt"
	}
	tbl["urn:schemas-micasaverde-com:device:WindSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMySensorsExt"
	}
	tbl["urn:schemas-micasaverde-com:device:ScaleSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMySensorsExt"
	}
	tbl["urn:schemas-micasaverde-com:device:DistanceSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMySensorsExt"
	}
	tbl["urn:schemas-micasaverde-com:device:Keypad:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawKeypad",
		["ControlPanelFunc"]="ALTUI_PluginDisplays.drawKeypadControlPanel"
	}
	tbl["urn:schemas-dcineco-com:device:MSwitch:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawMultiswitch"
	}
	tbl["urn:schemas-rboer-com:device:Harmony:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHarmony",
		["ControlPanelFunc"]=",ALTUI_PluginDisplays.drawHarmonyControlPanel"
	}
	tbl["urn:schemas-rboer-com:device:HarmonyDevice:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawHarmonyDevice",
		["ControlPanelFunc"]=",ALTUI_PluginDisplays.drawHarmonyDeviceControlPanel"
	}
	tbl["urn:schemas-shward1-com:device:avreceiver:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPioneer"
	}
	tbl["urn:schemas-upnp-org:device:VRainSensor:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVRain"
	}
	tbl["urn:schemas-airedalez-net:device:PlantLink:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawPlantlink"
	}
	tbl["urn:schemas-ecobee-com:device:EcobeeHouse:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawEcobeeH"
	}
	tbl["urn:schemas-upnp-org:device:altdenon:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawAltDenon"
	}
	tbl["urn:schemas-upnp-org:device:VClock:1"]= {
		["ScriptFile"]="J_ALTUI_plugins.js",
		["DeviceDrawFunc"]="ALTUI_PluginDisplays.drawVClock"
	}
	return tbl
end

function myhttpget(url)
	debug(string.format("myhttpget(%s)",url))
	response,content = luup.inet.wget(url,10)	-- note that 0 is a successful status return for this call
	return (response==0)
end

local function sendValuetoUrlStorage(url,watch_description,lul_device, lul_service, lul_variable,old, new, lastupdate, provider_params)
	debug(string.format("sendValuetoUrlStorage(%s,%s,%s,%s,%s,%s,%s,%s)",url,lul_device, lul_service, lul_variable,old, new, lastupdate, json.encode(provider_params)))
	debug(string.format("watch_description:%s",json.encode(watch_description)))
	local watchparams = json.decode( watch_description['Data'] )
	local i = 1
	local params={}
	for k,v in pairs(provider_params) do
		params[#params+1] = (v.key .. "=" .. modurl.escape(watchparams[i] or ''))
		i=i+1
	end
	for k,v in pairs({lul_device=lul_device,lul_service=lul_service,lul_variable=lul_variable,old=old,new=new,lastupdate=lastupdate}) do
		params[#params+1] = (k .. "=" .. modurl.escape(v or ''))
		i=i+1
	end

	-- adding device
	local parts = lul_device:altui_split("-")
	local devicename = luup.attr_get ('name', tonumber(parts[2] or lul_device ))
	params[#params+1] = ("name" .. "=" .. modurl.escape(devicename or ''))
	-- if finish by ? or by & just add to it
	-- if does not contain ?, then add ? then params
	-- if does contain ? , then add & then params
	local parameters = table.concat(params,"&")
	local lastchar = string.sub(url,-1)
	if (lastchar=="?") or (lastchar=="&") then
		url = url .. table.concat(params,"&")
	else
		if (string.find(url,"?")~=nil) then
			url = url .. "&" .. table.concat(params,"&")
		else
			url = url .. "?" .. table.concat(params,"&")
		end
	end
	debug(string.format("prepared to call url:%s",url))
	luup.call_delay("myhttpget",1,url)
	return 1
end

--https://api.thingspeak.com/update?key=U1F7T31MHB5O8HZI&field1=0
-- local function sendValueToStorage_toto(watch_description,lul_device, lul_service, lul_variable,old, new, lastupdate, provider_params)
	-- debug(string.format("sendValueToStorage_toto(%s,%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,old, new, lastupdate, json.encode(provider_params)))
	-- debug(string.format("watch_description:%s",json.encode(watch_description)))
-- end

local function sendValueToStorage_emoncms(watch_description,lul_device, lul_service, lul_variable,old, new, lastupdate, provider_params)
	debug(string.format("sendValueToStorage_emoncms(%s,%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,old, new, lastupdate, json.encode(provider_params)))
	debug(string.format("watch_description:%s",json.encode(watch_description)))
	local providerparams = json.decode( watch_description['Data'] )
	local lul_device = tonumber(lul_device)
	local emoncmsurl = getSetVariableIfEmpty(ALTUI_SERVICE, "EmonCmsUrl", lul_device, "https://emoncms.org")
	if (isempty(providerparams[1])==false) and (isempty(providerparams[2])==false) and (isempty(providerparams[3])==false) then
		local url = string.format("%s/input/post.json?node=%d&json={%s:%s}&apikey=%s",
			emoncmsurl,
			providerparams[1],	-- nodeid
			providerparams[3],	-- inputkey
			tostring(new),		-- new value
			providerparams[4]	-- readwritekey
		)
		local response,response_body = luup.inet.wget(url,10)
		-- local response_body = {}
		-- local response, status, headers = http.request({
			-- method="GET",
			-- url=url,
			-- sink = ltn12.sink.table(response_body)
		-- })
		debug(string.format("emoncms http Body=%s Response=%s",response_body,response ))
		return (response==0)
	end
	return nil
end

function _deferredPostIFTTT()
	debug(string.format("_deferredPostIFTTT : entering... IFTTT_Queue size=%d",IFTTT_Queue:size()))
	local obj = IFTTT_Queue:pull()
	if (obj~=nil) then
		local url = string.format("https://maker.ifttt.com/trigger/%s/with/key/%s",
			obj.event_name,
			obj.webhook_key)
		local result = {}
		local response, status, headers = https.request({
			method="POST",
			url = url,
			source= ltn12.source.string(obj.body),
			headers = {
				["Content-Type"] = "application/json",
				["Content-Length"] = obj.body:len(),
			},
			sink = ltn12.sink.table(result)
		})
		log(string.format("IFTTT POST url:%s body:%s => status:%s response:%s",url,obj.body or '', status or '',response or ''))
		if (response==1) then
			local completestring = table.concat(result)
			debug(string.format("ALTUI: Succeed to POST to %s , result=%s",url,completestring))
		else
			debug(string.format("ALTUI: Failed to POST to %s ",url))
		end
	else
		warning("_deferredPostIFTTT engine has nothing to do, ignoring call")
	end

	if (IFTTT_Queue:size() >0) then
		debug(string.format("Arming _deferredPostIFTTT engine. _deferredPostIFTTT size=%d",IFTTT_Queue:size()))
		luup.call_delay("_deferredPostIFTTT", 5, url)
	else
		debug(string.format("No need to rearm _deferredPostIFTTT engine. _deferredPostIFTTT size=%d",IFTTT_Queue:size()))
	end
end

local function sendValueToStorage_ifttt(watch_description,lul_device, lul_service, lul_variable,old, new, lastupdate, provider_params)
	debug(string.format("sendValueToStorage_ifttt(%s,%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,old, new, lastupdate, json.encode(provider_params)))
	debug(string.format("watch_description:%s",json.encode(watch_description)))

	local body = string.format('{"value1":"%s","value2":"%s","value3":"%s"}',
		lul_device,
		lul_service..":"..lul_variable,
		new
	)
	local providerparams = json.decode( watch_description['Data'] )
	IFTTT_Queue:add( {event_name=providerparams[2], webhook_key=providerparams[1], body=body} )
	if (IFTTT_Queue:size() == 1) then
		debug("Starting _deferredPostIFTTT engine")
		luup.call_delay("_deferredPostIFTTT", 1, null)
	end
	return 1
end

function prepareThingspeakUrl( todo )
	local url = string.format("https://api.thingspeak.com/update?api_key=%s",todo.api_key)
	local fieldstbl = {}
	for k,v in pairs(todo.fields) do
		table.insert( fieldstbl, string.format("field%s=%s",k,v) )
	end
	url = url .. "&" .. table.concat(fieldstbl, "&")
	return url
end

function _deferredWgetThingspeak()
	debug(string.format("_deferredWgetThingspeak : entering... Thingspeak_Queue size=%d",Thingspeak_Queue:size()))
	if (true) then
		local cb_obj = Thingspeak_Queue:getHead()
		if (cb_obj~=nil) then
			local channels = {}
			for k,v in Thingspeak_Queue:listReverse() do	-- from older to newer
				channels[ v.api_key ] = ( channels[ v.api_key ] or 0 ) +1
			end
			debug(string.format("Channels to update: %s",json.encode(channels)))
			
			for apikey,v in pairs(channels) do
				local todo = { fields = {}, indexes = {}, api_key=apikey }
				debug(string.format("Check for channels %s",apikey))
				
				for k,v in Thingspeak_Queue:listReverse() do	-- from older to newer
					-- debug(string.format("ELEM k:#%s v:%s",k,json.encode(v)))
					if (v.api_key == todo.api_key) then
						todo.fields[ v.field_num ] = v.value	-- most recent is kept
						table.insert( todo.indexes, k )			-- mark index k as to be deleted
					end
				end
				
				-- debug( string.format("_deferredWgetThingspeak is preparing to update => %s",json.encode(todo)) )
				local url = prepareThingspeakUrl( todo )
				local code,data,httpcode = luup.inet.wget(url)
				log(string.format("_deferredWgetThingspeak(url=%s) ==> code=%s httpcode=%s data=%s",url, code,httpcode,data ))
				
				if (data~="0") then
					-- clean up the queue now
					debug(string.format("Clean up indexes:%s for %s",json.encode(todo.indexes),todo.api_key))
					for k,v in ipairs(todo.indexes) do
						-- debug(string.format("remove ELEM k:#%s v:%s",v,json.encode(Thingspeak_Queue[v])))
						Thingspeak_Queue:removeItem(v)
					end
				else
					debug("_deferredWgetThingspeak failed to update thingspeak, will retry the same url next time")
				end
			end
		else
			warning("_deferredWgetThingspeak engine has nothing to do, ignoring call")
		end
		if (Thingspeak_Queue:size() >0) then
			debug(string.format("Arming _deferredWgetThingspeak engine. Thingspeak_Queue size=%d",Thingspeak_Queue:size()))
			luup.call_delay("_deferredWgetThingspeak", THINGSPEAK_PUSH_SEC, url)	
		else
			debug(string.format("No need to rearm _deferredWgetThingspeak engine. Thingspeak_Queue size=%d",Thingspeak_Queue:size()))
		end
	end
end

local function _CallThingspeakAPI(api_key,field_num,value)
	local cb_obj = { api_key=api_key, field_num=field_num, value= tostring(value) }
	Thingspeak_Queue:push(cb_obj)
	if (Thingspeak_Queue:size() == 1) then
		debug("new entry , Queue size==1 , Starting _deferredWgetThingspeak engine")
		luup.call_delay("_deferredWgetThingspeak", 1 , null)		-- there is something to do immediately
	end
	return 200,""
end

local function sendValueToStorage_thingspeak(watch_description,lul_device, lul_service, lul_variable,old, new, lastupdate, provider_params)
	debug(string.format("sendValueToStorage_thingspeak(%s,%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,old, new, lastupdate, json.encode(provider_params)))
	debug(string.format("watch_description:%s",json.encode(watch_description)))
	local providerparams = json.decode( watch_description['Data'] )

	if (isempty(providerparams[3])==false) and ((isempty(providerparams[4])==false)) then
		local httpcode,data = _CallThingspeakAPI(providerparams[3] or "",providerparams[4] or "",string.match (new, "%S+"))
		return httpcode or 0
	else
		error("invalid parameters for thingspeak")
	end
	return 0
end

local function table_search (tt, v,stack,level)
	local key, value
	if level > 5 then
		return nil
	end
	-- debug(string.format("table_search(v=%s,stack%s)",v,stack))
	if type(tt) == "table" then
		for key, value in pairs (tt) do
			if key ~= v then
				--debug(string.format("table_search: new table found , key=%s",key))
				local r = table_search(value, v,stack.."-"..key,level+1 )
				if r ~= nil then
					return r
				end
			elseif key == v then
				debug(string.format("table_search: found value! key=%s",key))
				return value
			else
			--debug(string.format("Searching for value %s, Ignoring value %s/%s",v,stack,key))
			end
		end
	end
	return nil
end

local function _loadDataProviders()
	local str = luup.variable_get(ALTUI_SERVICE, "DataStorageProviders",  lul_device) or "{}"
	debug(string.format("_loadDataProvider()->%s",str) )
	DataProviders = json.decode(str)
	for k,v in pairs (DataProviders) do
		if (v["callback"] ~= nil) then
			debug(string.format("_loadDataProvider(), callback->%s",v["callback"]))
			local callback_fn = table_search(_G,v["callback"],"",0)
			if callback_fn ~= nil then
				debug(string.format("_loadDataProvider(), callback->%s found function",v["callback"]))
				DataProvidersCallbacks[v["callback"]] = callback_fn
			end
		end
	end
end

local function _saveDataProvider()
	local lul_device = tonumber(findALTUIDevice() )
	debug(string.format("_saveDataProvider() , DataStorageProviders:%s",json.encode(DataProviders)))
	luup.variable_set(ALTUI_SERVICE, "DataStorageProviders", json.encode(DataProviders), lul_device)
end

function registerDataProvider(name, funcname, func, url, parameters)
	debug(string.format("registerDataProvider(%s,%s,%s,%s)",name or 'nil',funcname or 'nil',url or 'nil',json.encode(parameters)))
	if (name ~= nil) then
		DataProviders[name]= {
			["callback"] = (funcname or ""),
			["url"] = (url or ""),
			["parameters"] = (parameters or "")
		}
		if (funcname ~= nil) and (func ~=nil) then
			DataProvidersCallbacks[funcname] = func
		end
		_saveDataProvider()
	end
end

function resetDevice(lul_device,reload)
	lul_device = tonumber(lul_device)
	log(string.format("resetDevice(%d,%s)",lul_device, tostring(reload or "nil")))

	if (reload ~= true) then
		reload = false
	end

	-- reset the config
	local tbl = getDefaultConfig()
	local default = json.encode( tbl )
	debug(string.format("Reseting ALTUI config to %s",default))
	setVariableIfChanged(ALTUI_SERVICE, "PluginConfig", default, lul_device)

	-- reset workflows and timers
	Workflows = {}
	WorkflowsActiveState = {}
	WorkflowsVariableBag = {}
	ForcedValidLinks = {}
	Timers = {}
	luup.variable_set(ALTUI_SERVICE, "WorkflowsActiveState", json.encode(WorkflowsActiveState), lul_device)
	luup.variable_set(ALTUI_SERVICE, "WorkflowsVariableBag", json.encode(WorkflowsVariableBag), lul_device)
	luup.variable_set(ALTUI_SERVICE, "Timers", "", lul_device)
	setVariableIfChanged(ALTUI_SERVICE, "RemoteAccess", REMOTEACCESS_URL, lul_device)
	-- default jquery and bootstrap version
	setVariableIfChanged(ALTUI_SERVICE, "SWVersion", SWVERSION .. "/" .. BOOTSTRAPVERSION, lul_device)

	if (reload==true) then
		debug("Forcing a Luup reload")
		luup.variable_set(ALTUI_SERVICE, "PendingReset", 1, lul_device)
		local httpcode,data = luup.inet.wget("http://127.0.0.1"..port3480.."/data_request?id=reload",10)
	end
	return default
end

local function mp3Duration(MP3FilePath)
    local lfs = require "lfs"
    local mp3FileBytes =  lfs.attributes (MP3FilePath, "size")
    -- local mp3DurationinSeconds =  math.floor ((mp3FileBytes / 1024)*8)/64
    local mp3DurationinSeconds =  mp3FileBytes/58000*16
    return math.ceil(mp3DurationinSeconds)
end

local function createMP3file(lul_device,newMessage)
	local api_key = getSetVariable(ALTUI_SERVICE, "VoiceRSS_KEY", lul_device, "")
	local language = getSetVariable(ALTUI_SERVICE, "VoiceRSS_lang", lul_device, "en-us")
	if (api_key == "") then
		error(string.format("ALTUI has no defined API key for VoiceRSS. Request is ignored"))
		return nil
	end
	local url = "https://api.voicerss.org/?" .. "key=".. api_key .."&src="..newMessage.."&hl="..language.."&c=MP3&f=44khz_16bit_mono"
	debug(string.format("calling url: %s",url))
	-- return url  => should work but does not for some reasons.

	local operationStatusCode, content, httpStatusCode = luup.inet.wget(url,60)
	debug(string.format("operationStatusCode:%s, httpStatusCode:%s",operationStatusCode or 'nil',  httpStatusCode or 'nil'))
	debug(string.format("content:%s",json.encode(content or "")))
	if (operationStatusCode ~= 0) then
		return nil
	end

	local filename = "/www/altui/"..ALTUI_TMP_PREFIX..math.random(1,100000)..".mp3"
	-- local filename = "/www/altui/"..ALTUI_SONOS_MP3
	local f,errmsg,errno = io.open(filename, "wb")
	if (f==nil) then
		error(string.format("ALTUI could not open the file %s in wb mode. check path & permissions. msg:%s",ALTUI_SONOS_MP3,errmsg))
		return nil
	end
	f:write(content)
	f:close()
	
	-- remove /www/ from filename
	local cleanfilename = filename:gsub('/www/altui/','')
	-- schedule a cleanup in 15 min ( or in reload )
	luup.call_delay("clearAltuiFile", 15*60, cleanfilename)
	return string.format("http://%s/altui/%s",hostname,cleanfilename) , mp3Duration(filename)
end

function sayTTS(lul_device,newMessage,volume,groupDevices,durationMs)
	lul_device = tonumber(lul_device)
	newMessage = modurl.escape( newMessage or "" )
	volume = volume or 0
	groupDevices = groupDevices or ""
	log(string.format("sayTTS(%d,%s,%s,%s)",lul_device, newMessage,volume,groupDevices))

	local uri = string.starts(newMessage,"http") and newMessage or createMP3file(lul_device,newMessage)
	local resultCode, resultString, job, returnArguments
	resultCode = -1
	if (uri ~= nil) then
		local sonos,typ = findSONOSDevice()
		if (sonos~=-1) then
			if (typ==1) then
				local params = {URI=uri,Volume=volume,SameVolumeForAll=true, Duration=durationMs}
				if (groupDevices ~= "") then
					params["GroupDevices"]= groupDevices
				else
					params["GroupZones"]= "ALL"
				end
				resultCode, resultString, job, returnArguments = luup.call_action("urn:micasaverde-com:serviceId:Sonos1", "Alert", params, sonos )
			else
				local params = {urlClip=uri, Duration=durationMs, Volume=volume }
				if (groupDevices ~= "") then
					params["groupID_playerID"]= groupDevices
				else
					params["groupID_playerID"]= "ALL"
				end
				resultCode, resultString, job, returnArguments = luup.call_action("urn:upnp-org:serviceId:altsonos1", "AudioClip", params, sonos )
			end
		end
	end
	return resultCode
end

function UPNPregisterDataProvider(lul_device, newName, newUrl, newJsonParameters)
	newName = newName or ''
	newUrl = newUrl or ''
	newJsonParameters = newJsonParameters or ''
	log(string.format("UPNPregisterDataProvider(%d,%s,%s,%s)",lul_device, newName , newUrl , newJsonParameters ))
	if (newName=="") or (newUrl=="") or (newJsonParameters=="") then
		warning("invalid parameters, ignoring request");
		return 0
	end
	local status,obj = pcall( function(newJsonParameters) return json.decode(newJsonParameters) end, newJsonParameters )
	if (status==true) then
		registerDataProvider(newName, nil, nil, newUrl, obj )
		return 1
	end
	warning(string.format("invalid json parameters, %s",newJsonParameters));
	return 0
end

function UPNPunregisterPlugin(lul_device,newDeviceType)
	log(string.format("UPNPunregisterPlugin(%d,%s)",lul_device,newDeviceType))
	local tbljson = getSetVariable(ALTUI_SERVICE, "PluginConfig", lul_device, json.encode( getDefaultConfig() ) )
	local tbl = json.decode(tbljson)	
	tbl[newDeviceType] = nil
	setVariableIfChanged(ALTUI_SERVICE, "PluginConfig", json.encode( tbl ), lul_device)
end

function UPNPregisterPlugin(lul_device,newDeviceType,newScriptFile,newDeviceDrawFunc,newStyleFunc,newDeviceIconFunc,newControlPanelFunc,newFavoriteFunc)
	newScriptFile = newScriptFile or ""
	newDeviceDrawFunc = newDeviceDrawFunc or ""
	newStyleFunc = newStyleFunc or ""
	newDeviceIconFunc = newDeviceIconFunc or ""
	newControlPanelFunc = newControlPanelFunc or ""
	newFavoriteFunc = newFavoriteFunc or ""
	log(string.format("UPNPregisterPlugin(%d,%s,%s,%s,%s,%s,%s,%s)",lul_device,newDeviceType,newScriptFile,newDeviceDrawFunc,newStyleFunc,newDeviceIconFunc,newControlPanelFunc,newFavoriteFunc))
	if (newDeviceType ~= "") then
		local tbljson = getSetVariable(ALTUI_SERVICE, "PluginConfig", lul_device, json.encode( getDefaultConfig() ) )
		local tbl = json.decode(tbljson)
		if (tbl[newDeviceType] == nil) then
			tbl[newDeviceType]={}
		end
		for k,v	 in pairs({ ["ScriptFile"]=newScriptFile,["DeviceDrawFunc"]=newDeviceDrawFunc,["StyleFunc"]=newStyleFunc,["DeviceIconFunc"]=newDeviceIconFunc,["ControlPanelFunc"]=newControlPanelFunc,["FavoriteFunc"]=newFavoriteFunc}) do
			if (v~="") then
				tbl[newDeviceType][k]=v
			end
		end
		setVariableIfChanged(ALTUI_SERVICE, "PluginConfig", json.encode( tbl ), lul_device)
	else
		debug("Ignored, empty device type")
	end
end

------------------------------------------------
-- User Level API functions for watches
------------------------------------------------
function trueSince(cond,delay)
	delay = delay or 0
	debug(string.format("sinceWatch(%s,%d)",tostring(cond),delay))
	return cond,delay
end
function midnight(timestamp)
	local t = os.date('*t',timestamp)
	t.hour=0
	t.min=0
	t.sec=0
	return os.time(t)
end

function timeOf(timestamp)
  local t2= midnight(timestamp)
  return os.difftime(timestamp,t2)
end

function _evalCode(str,opt_wkflowidx)
	debug(string.format("_evalCode(%s , %d)",str,opt_wkflowidx))
	local result = nil
	local code = "return "..str
	local f,msg = loadstring(code,"ALTUI - _evalCode")
	if (f==nil) then
		error(string.format("loadstring %s failed to compile, msg=%s",code,msg))
	else
		-- set Environment
		local env = { ALTUI=ALTUI, Bag = WorkflowsVariableBag[ Workflows[opt_wkflowidx].altuiid ] , WorkflowsVariableBag=WorkflowsVariableBag}
		setfenv(f, setmetatable (env, {__index = _G, __newindex = _G}))
		result = f()
	end
	-- debug(string.format("_evalCode returns %s",result))
	return result
end

function _evaluateUserExpression(lul_device, devid, lul_service, lul_variable,old,new,lastupdate,expr,opt_wkflowidx)
	new = new or ""
	debug(string.format("_evaluateUserExpression(%s,%s,%s,%s,%s,%s,%s,%s)",lul_device, devid, lul_service, lul_variable,old or "", new,tostring(lastupdate),expr))
	local results = {}
	local code = [[
		return function(devid, lul_service, lul_variable, expr)
			local old='%s'
			local new='%s'
			local lastupdate=%s
			local now=os.time()
			local results= {%s}	-- eventually returns 2 results, cond and delay
			return results
		end
	]]
	code = string.format(code,old,new,lastupdate,expr)
	local f,msg = loadstring(code,"ALTUI - evaluateUserExpression")
	if (f==nil) then
		error(string.format("loadstring %s failed to compile, msg=%s",code,msg))
	else
		-- set Environment
		local env = {}
		if (opt_wkflowidx~=nil) then
			env = { ALTUI=ALTUI, Bag = WorkflowsVariableBag[ Workflows[opt_wkflowidx].altuiid ] , WorkflowsVariableBag=WorkflowsVariableBag}
		end
		setfenv(f, setmetatable (env, {__index = _G, __newindex = _G}))
		local func = f()	-- call it
		local status=false

		-- Call it now
		setfenv(func, setmetatable (env, {__index = _G, __newindex = _G}))
		status,results = pcall( func, devid, lul_service, lul_variable,expr )

		if (status==true) then
			-- update from Environment
			if (opt_wkflowidx~=nil) then
				WorkflowsVariableBag[ Workflows[opt_wkflowidx].altuiid ] = env.Bag
				setVariableIfChanged(ALTUI_SERVICE, "WorkflowsVariableBag", json.encode(WorkflowsVariableBag), lul_device)
			end
			debug(string.format("Evaluation: user expression %s returned: %s",expr,json.encode(results)))
		else
			warning(string.format("Evaluation: user expression %s -- Exception occured: %s",expr,results))
			results = { false }
		end
	end
	return results
end


function sendValueToStorage(watch,lul_device, lul_service, lul_variable,old, new, lastupdate)
	debug(string.format("sendValueToStorage(%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,old, new, lastupdate))
	for provider,v	in pairs(watch['DataProviders']) do
		debug(string.format("Data Provider watch provider:%s v:%s",provider,json.encode(v)))
		local n = tablelength(watch['DataProviders'][provider])
		for i=1,n do
			if (DataProviders[provider]~=nil) then
				if (DataProviders[provider]["url"]~="") then
					if (sendValuetoUrlStorage(DataProviders[provider]["url"],v[i],lul_device, lul_service, lul_variable,old, new, lastupdate,DataProviders[provider]["parameters"]) == nil) then
						warning(string.format("sendValuetoUrlStorage() failed"))
					end
				else
					debug(string.format("sendValueToStorage: No url, will use callback instead"))
					local callback_fn = DataProvidersCallbacks[DataProviders[provider]["callback"]]
					if(callback_fn~=nil) then
						(callback_fn)(v[i],lul_device, lul_service, lul_variable,old, new, lastupdate,DataProviders[provider]["parameters"])
					else
						warning(string.format("sendValueToStorage: both callback and url are missing for provider:%s",provider))
					end
				end
			else
				warning(string.format("sendValueToStorage - unknown provider:%s",provider))
			end
		end
	end
	return 0
end

function evaluateExpression(watch,lul_device, lul_service, lul_variable,expr,old, new, lastupdate, exp_index, scene)
	old = old or ""
	new = new or ""
	debug(string.format("evaluateExpression(%s,%s,%s,%s,%s,%s,%s,%s,%s)",lul_device, lul_service, lul_variable,expr,old, new, tostring(lastupdate),exp_index,scene))
	-- local watch = findWatch( lul_device, lul_service, lul_variable )
	if (watch==nil) then
		return
	end

	local results = _evaluateUserExpression(this_device, lul_device, lul_service, lul_variable,old,new,lastupdate,expr,nil)
	local res,delay = results[1], results[2] or nil

	-- if it evaluates as FALSE , do not do anything & cancel timer
	if (res==nil or res==false or tonumber(res)==0) then
		debug(string.format("ignoring watch trigger, loadstring returned %s",tostring(res)))
		-- cancelling the timer for that expression as the condition is false now before the timer expired
		watch['Expressions'][expr][exp_index]["PendingTimer"] = nil
	else
		-- if it evaluates as TRUE,
		if (delay ~=nil ) then
			-- if it is a defered response,
			if (watch['Expressions'][expr][exp_index]["PendingTimer"]==nil) then
				-- if new timer
				local tbl = {lul_device, lul_service, lul_variable,expr}
				local timer = luup.call_delay("watchTimerCB",delay, table.concat(tbl, "#") ) or 1
				if (timer==0) then
					debug("preparing timer watchTimerCB with delay "..delay)
					watch['Expressions'][expr][exp_index]["PendingTimer"]=1
				else
					error("luup.call_delay failed !")
					watch['Expressions'][expr][exp_index]["PendingTimer"]=nil
				end
			else
				-- already a running timer, still true, do nothing wait for the timer
				debug("already a running timer, still true, do nothing wait for the timer")
			end
		else
			-- if it is a immediate response, then run the scene
			if (scene ~= -1 ) then
				local scene_res = run_scene(scene)
				if (scene_res==-1) then
					error(string.format("Failed to run the scene %s",scene))
				end
			end
		end
	end
	debug(string.format("evaluateExpression(%s) returns %s",expr,tostring(res)))
	return res
end

function _internalVariableWatchCB(lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
	debug(string.format("_internalVariableWatchCB(%s,%s,%s,old:'%s',new:'%s') - (Wkflow)",lul_device, lul_service, lul_variable, lul_value_old, lul_value_new))
	local watch = findWatch( lul_device, lul_service, lul_variable )
	if (watch==nil) or (watch['Expressions']==nil )then
		warning(string.format("ignoring unexpected watch callback, variableWatchCallback(%s,%s,%s,old:'%s',new:'%s')",lul_device, lul_service, lul_variable, lul_value_old, lul_value_new))
		return
	else
		watch["LastOld"] = lul_value_old
		watch["LastNew"] = lul_value_new
		watch["LastUpdate"] = os.time()
		debug(string.format("-----> evaluateExpression() %s",json.encode(watch['Expressions'] )))
		for k,v	 in pairs(watch['Expressions'] or {}) do
			if (k=="workflow") then
				local watchevent = { device=lul_device, service=lul_service, variable=lul_variable, watch=watch }
				executeWorkflows( findALTUIDevice() , watchevent)
				-- watchevent.watch['Expressions']['results']["LastEval"]
	 -- elseif (k~="results") then
			else
				-- watch['Expressions'][k] is a table of object			{ ["LastEval"] = nil, ["SceneID"] = scene }
				-- v is an object
				for exp_index,target in ipairs(watch['Expressions'][k]) do
					watch['Expressions'][k][exp_index]["LastEval"] = evaluateExpression(watch,lul_device, lul_service, lul_variable,k,lul_value_old, lul_value_new, watch["LastUpdate"], exp_index, target["SceneID"])
					debug(string.format(">>>evaluated %s, index:%s LastEval:%s",k,exp_index,tostring(watch['Expressions'][k][exp_index]["LastEval"])))
				end
			end
		end
		debug(string.format("-----> DataProviders() %s",json.encode(watch['DataProviders'])))
		if (watch['DataProviders'] ~=nil) then
			sendValueToStorage(watch,lul_device, lul_service, lul_variable,lul_value_old, lul_value_new, watch["LastUpdate"])
		end
	end
	debug(string.format("registeredWatches: %s",json.encode(registeredWatches)))
end

function variableWatchCallbackFromRemote(ctrlid, lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
	lul_device = tostring(ctrlid).."-"..lul_device
	_internalVariableWatchCB(lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
end

function variableWatchCallback(lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
	lul_device = "0-"..lul_device
	_internalVariableWatchCB(lul_device, lul_service, lul_variable, lul_value_old, lul_value_new)
end

function addWatch( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, providerparams )
	-- channelid, readkey, writekey, field, graphicurl
	debug(string.format("addWatch(%s,%s,%s,%s,%s,%s,%s,%s,%s)",lul_device, service, variable, deviceid, sceneid, expression, xml or "", provider or "", json.encode(providerparams or "")))
	-- 1/ Add Watch in database
	local newwatch = _addWatch( service, variable, deviceid, sceneid, expression or '', xml or '', provider or '', providerparams or {} )

	-- 2/ Add Watch in persistence list ( device variable )
	if (sceneid ~=-1) then
		-- classic watch
		local watchline = setWatchParams(service,variable,deviceid,sceneid,expression,xml)
		debug(string.format("searching if watchline already exists: %s",watchline))
		local variableWatch = getSetVariable(ALTUI_SERVICE, "VariablesToWatch", lul_device, "")
		local bFound = false;
		for k,v	 in pairs(variableWatch:altui_split(';')) do
			local wservice,wvariable,wdevice,wscene,wexpression,wxml  = getWatchParams(v)
			if (service==wservice) and (variable==wvariable) and (deviceid==wdevice) and (sceneid==wscene) and (expression==wexpression) and (xml==wxml) then
				bFound = true;
			end
		end
		if (bFound==false) then
			debug(string.format("no, adding watchline %s",watchline))
			if (variableWatch~="") then
				variableWatch = watchline .. ";" .. variableWatch
			else
				variableWatch = watchline
			end
			luup.variable_set(ALTUI_SERVICE, "VariablesToWatch", variableWatch, lul_device)
		else
			debug(string.format("yes, found an existing watchline"))
		end
	else
		-- data push watch
		local watchline = setPushParams(service,variable,deviceid,provider,providerparams)
		debug(string.format("searching if watchline already exists: %s",watchline))
		local variableWatch= getSetVariable(ALTUI_SERVICE, "VariablesToSend", lul_device, "")
		local bFound = false;
		for k,v	 in pairs(variableWatch:altui_split(';')) do
			if (v==watchline) or (((v..'#')==watchline) ) then
				debug(string.format("watch line already exist:%s",v))
				bFound = true;
			end
		end
		if (bFound==false) then
			debug(string.format("no, adding watchline %s",watchline))
			variableWatch = watchline .. ";" .. variableWatch
			luup.variable_set(ALTUI_SERVICE, "VariablesToSend", variableWatch, lul_device)
		end
	end
	return tostring(newwatch)
end

function _delWatch(service, variable, deviceid, sceneid, expression, xml, provider, providerparams )
	debug(string.format("_delWatch(%s,%s,%s,%s,%s,%s,%s,%s)",service, variable, deviceid, sceneid, expression, xml or "", provider or "", json.encode(providerparams)))
	local data = json.encode(providerparams)
	local devidstr = tostring(deviceid)	 -- to inssure it is not a indexed array , but hash table
	local parts = devidstr:altui_split("-")
	if (parts[2]==nil) then
		devidstr = "0-"..devidstr
		parts = devidstr:altui_split("-")
	end
	-- registeredWatches[devidstr][service][variable]['Expressions'][expression][n+1]
	-- local n = tablelength(registeredWatches[devidstr][service][variable]['Expressions'][expression])
	local removed=0
	if (registeredWatches[devidstr] ~= nil) and (registeredWatches[devidstr][service] ~= nil) and (registeredWatches[devidstr][service][variable] ~= nil) and (registeredWatches[devidstr][service][variable]['Expressions'][expression] ~= nil) then
		if (sceneid==-1) then
			-- watch for push
			-- if (registeredWatches[devidstr][service][variable]['DataProviders']DataProviders[i]['Data']==data) then
			local n = tablelength(registeredWatches[devidstr][service][variable]['DataProviders'][provider])
			for i=n,1,-1 do
				if (registeredWatches[devidstr][service][variable]['DataProviders'][provider][i]['Data']~=nil) then
				-- if (registeredWatches[devidstr][service][variable]['DataProviders'][provider][i]['Data']==data) then
					table.remove(registeredWatches[devidstr][service][variable]['DataProviders'][provider],i)
					removed = removed +1
				end
			end

			-- remove the same number of entries from the expressions table with expression==(true) and SceneID==-1
			local expr_deleted = 0
			local n2 = tablelength(registeredWatches[devidstr][service][variable]['Expressions']["true"])
			for i=n2, 1 , -1 do
				if (registeredWatches[devidstr][service][variable]['Expressions']["true"][i].SceneID ==	 -1) then
					registeredWatches[devidstr][service][variable]['Expressions']["true"][i] = nil
					expr_deleted  = expr_deleted +1
					if (expr_deleted == removed) then
							break
					end
				end
			end

			if (removed == n) then
				registeredWatches[devidstr][service][variable]['DataProviders'][provider]=nil
			end

		else
			-- watch for scene
			local n = tablelength(registeredWatches[devidstr][service][variable]['Expressions'][expression])
			for i=n,1,-1 do
				if (registeredWatches[devidstr][service][variable]['Expressions'][expression][i]["SceneID"] == sceneid) then
					table.remove(registeredWatches[devidstr][service][variable]['Expressions'][expression], i)
					removed = removed +1
				end
			end
			if (removed == n) then
				registeredWatches[devidstr][service][variable]['Expressions'][expression]=nil
			end
		end
		if (removed==0) then
			warning("did not removed anything")
		end
	end
	if (parts[1] ~= "0") then
		-- Remote Watch
		local extraController= getSetVariable(ALTUI_SERVICE, "ExtraController", lul_device, "")
		local controllers = extraController:altui_split(",")
		local ipaddr =	controllers [ tonumber(parts[1]) ]:trim()
		local url = string.format("http://%s%s/data_request?id=lr_ALTUI_Handler&command=delRemoteWatch&device=%s&variable=%s&service=%s&ctrlid=%s&ipaddr=%s",
			ipaddr,		-- remote ctrl ip addr
			port3480,
			parts[2],	-- pure vera device id on remote controller
			variable,
			service,
			parts[1],	-- controller id for ALTUI
			hostname	-- local IP address for callback
			)
		debug(string.format("Calling url to delete remote watch. url:%s",url))
		local httpcode,data = luup.inet.wget(url,10)
		if (httpcode~=0) then
			error(string.format("failed to connect to url:%s, http.request returned %d", url,httpcode))
			return 0
		end
		debug(string.format("success httpcode:%s data:%s",httpcode,data))
	end
	return removed
end

function delWatch( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, providerparams )
	debug(string.format("delWatch(%s,%s,%s,%s,%s,%s,%s,%s,%s)",lul_device, service, variable, deviceid, sceneid, expression, xml or "", provider or "", json.encode(providerparams)))
	-- remove from DB and  call the remote controller to remove the watch too
	graphicurl = graphicurl or ""
	local removed = _delWatch(service, variable, deviceid, sceneid, expression, xml, provider, providerparams )

	--	remove from persistent list
	if (sceneid ~=-1) then
		-- classic watch
		local watchline = setWatchParams(service,variable,deviceid,sceneid,expression,xml)
		debug(string.format("Watch to delete: %s",watchline))
		local variableWatch = getSetVariable(ALTUI_SERVICE, "VariablesToWatch", lul_device, "")
		local toKeep = {}
		for k,v	 in pairs(variableWatch:altui_split(';')) do
			-- local wservice,wvariable,wdevice,wscene,wexpression,wxml	 = getWatchParams(v)
			-- if (service~=wservice) or (variable~=wvariable) or (deviceid~=wdevice) or (sceneid~=wscene) or (expression~=wexpression) or (xml~=wxml) then
			if (v~=watchline) and (( (v..'#')~=watchline)) then
				debug(string.format("Keeping this watch: [%s], wanting this watch: [%s]",v,watchline))
				table.insert(toKeep, v)
			end
		end
		luup.variable_set(ALTUI_SERVICE, "VariablesToWatch", table.concat(toKeep,";"), lul_device)
	else
		-- data push watch
		local watchline = setPushParams(service,variable,deviceid,provider,{})	 --ignore providerparams
		debug(string.format("Watch to delete: %s",watchline))
		local variableWatch= getSetVariable(ALTUI_SERVICE, "VariablesToSend", lul_device, "")
		local toKeep = {}
		for k,v	 in pairs(variableWatch:altui_split(';')) do
			if (string.starts(v,watchline) == true) then
			-- if (v == watchline) then
				debug(string.format("Going to delete this watch: %s",v))
			else
				debug(string.format("Keeping this watch: [%s], wanting this watch: [%s]",v,watchline))
				table.insert(toKeep, v)
			end
		end
		luup.variable_set(ALTUI_SERVICE, "VariablesToSend", table.concat(toKeep,";"), lul_device)
	end
	debug(string.format("registeredWatches: %s",json.encode(registeredWatches)))
	debug(string.format("delWatch() returns: %d",removed))
	return tostring(removed)
end

function fixWatches_V_1_2(lul_device)
	debug(string.format("fixWatches_V_1_2(%s)",lul_device ))
	local tosend = getSetVariable(ALTUI_SERVICE, "VariablesToSend", lul_device, "")
	if (tosend~="") then
		local watches = tosend:altui_split(";")
		for k,watch in pairs(watches) do
			local parts = watch:altui_split('#')
			-- part 7 = key=U1F7T31MHB5O8HZI&field3=%s
			local key,field = string.match(parts[7],"^key=(.-)&field(.-)=.-$")
			parts[9]=parts[8]
			parts[8]=field
			parts[7]=key
			watches[k] = table.concat(parts,"#")
		end
		luup.variable_set(ALTUI_SERVICE, "VariablesToSend", table.concat(watches,";"), lul_device)
	end
end

function fixVariableWatchesDeviceID( lul_device )
	debug(string.format("fixVariableWatchesDeviceID(%s)",lul_device ))
	local strings = {
		["VariablesToWatch"]=getSetVariable(ALTUI_SERVICE, "VariablesToWatch", lul_device, ""),
		["VariablesToSend"]=getSetVariable(ALTUI_SERVICE, "VariablesToSend", lul_device, ""),
		["RemoteVariablesToWatch"]=getSetVariable(ALTUI_SERVICE, "RemoteVariablesToWatch", lul_device, "")
	}
	for k,v in pairs(strings) do
		local watches = v:altui_split(";")
		for k2,v2 in pairs(watches) do
			if (v2 ~= "" ) then
				local parts = v2:altui_split('#')
				local deviceid = parts[3]
				if (string.find(deviceid,"-") == nil) then
					deviceid = "0-"..deviceid
					parts[3] = deviceid
				end
				if (string.starts(deviceid,"0-") ==true) then
					-- make sure the device id exists
					local veraid = deviceid:altui_split("-")[2]
					if ( luup.devices[ tonumber(veraid) ] == nil ) then
						warning(string.format("Inexistant device %s in watch %s. Deleting watch",veraid,v2))
						parts={}
					end
				end
				watches[k2] = table.concat(parts,"#")
			end
		end
		luup.variable_set(ALTUI_SERVICE, k, table.concat(watches,";"):gsub("^;", ""):gsub(";;", ";"), lul_device)
	end
end

function initVariableWatches( lul_device )
	debug(string.format("initVariableWatches(%s)",lul_device ))
	local variableWatchString = getSetVariable(ALTUI_SERVICE, "VariablesToWatch", lul_device, "")	-- service#variable#deviceid#sceneid;service#variable#deviceid#sceneid
	local dataPushString= getSetVariable(ALTUI_SERVICE, "VariablesToSend", lul_device, "")	-- service#variable#deviceid#providername; ...
	local remoteVariableWatch = getSetVariable(ALTUI_SERVICE, "RemoteVariablesToWatch", lul_device, "")

	local watches = variableWatchString:altui_split(";")
	-- local toKeep = {}
	for k,v	 in pairs(watches) do
		if (v~="") then
			local service,variable,device,scene,expression,xml	= getWatchParams(v)
			_addWatch( service,variable,device,scene,expression )
			-- table.insert(toKeep, setWatchParams(service,variable,device,scene,expression,xml or "") )
		end
	end

	-- urn:micasaverde-com:serviceId:SceneController1#LastSceneID#208#thingspeak#key=U1F7T31MHB5O8HZI&field1=0
	watches = dataPushString:altui_split(";")
	-- toKeep = {}
	for k,v	 in pairs(watches) do
		if (v~="") then
			local service,variable,device,provider,providerparams  = getPushParams(v)
			_addWatch(	service, variable, device, -1, "true", "", provider, providerparams )
		end
	end

	watches = remoteVariableWatch:altui_split(";")
	for k,v	 in pairs(watches) do
		if (v~="") then
			local service,variable,device,ctrlid,ipaddr = getRemoteWatchParams(v)
			addRemoteWatch(lul_device,service,variable,device,ctrlid,ipaddr)
		end
	end
end


------------------------------------------------
-- THINGSPEAK integration
------------------------------------------------
-- data : https://thingspeak.com/docs/channels#api_keys
-- function sendToDataStorage(api_write_key,data)
	-- require('ltn12')
	-- local socket = require("socket")
	-- local http = require("socket.http")

	-- local base_url = "http://api.thingspeak.com/update"
	-- local method = "POST"

	-- local response_body = {}
	-- local response, status, header = http.request{
		-- method = method,
		-- url = base_url,
		-- headers = {
			-- ["Content-Type"] = "application/x-www-form-urlencoded",
			-- ["Content-Length"] = string.len(data),
			-- ["X-THINGSPEAKAPIKEY"] = api_write_key
		-- },
		-- source = ltn12.source.string(data),
		-- sink = ltn12.sink.table(response_body)
	-- }
	-- return response
-- end

------------------------------------------------
-- STARTUP Sequence
------------------------------------------------
function loadCode( code , lul_device)
	local req = "http://127.0.0.1".. port3480 .."/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&Code="
	-- code = "require 'L_ALTUI_LuaRunHandler'\n"
	code = "local altui_device = "..lul_device.."\n"..code
	req = req .. modurl.escape(code)
	local httpcode,content = luup.inet.wget(req)
	return httpcode,content
end

function registerHandlers(lul_device)
	luup.register_handler("myALTUI_Handler","ALTUI_Handler")
	-- luup.register_handler('ALTUI_LuaRunHandler','ALTUI_LuaRunHandler')

	local code = [[

	local printResult = {}
	local function myPrint (...)
		local arg = {}
		for i = 1, select("#", ...) do
		local x = select(i, ...)
			arg[i] = tostring(x)
		end
		table.insert (printResult, table.concat (arg, " \t"))
	end

	local function pretty (Lua)	   -- 2014 - 2016.03.10	  @akbooer
	  local con, tab, enc = table.concat, '	 ', {[_G] = "_G"}				 -- don't expand global environment
	  local function ctrl(y) return ("\\%03d"): format (y:byte ()) end		 -- deal with escapes, etc.
	  local function str_obj(x) return '"' .. x:gsub ("[\001-\031]", ctrl) .. '"' end
	  local function brk_idx(x) return '[' .. tostring(x) .. ']' end
	  local function str_idx(x) return x:match "^[%a_][%w_]*$" or brk_idx(str_obj (x)) end
	  local function nl (d,x) if x then return '\n'..tab:rep (d),'\n'..tab:rep (d-1) else return '','' end end
	  local function val (x, depth, name)
		if enc[x] then return enc[x] end									-- previously encoded
		local t = type(x)
		if t ~= "table" then return (({string = str_obj})[t] or tostring) (x) end
		enc[x] = name														-- start encoding this table
		local idx, its, y = {}, {}, {rawget (x,1) or rawget (x,2) and true}
		for i in pairs(x) do												-- fix isolated nil numeric indices
		  y[i] = true; if (type(i) == "number") and rawget(x,i+2) then y[i+1] = true end
		end
		for i in ipairs(y) do												-- contiguous numeric indices
		  y[i] = nil; its[i] = val (rawget(x,i), depth+1, con {name,'[',i,']'})
		end
		if #its > 0 then its = {con (its, ',')} end							-- collapse to single line
		for i in pairs(y) do
		  if (rawget(x,i) ~= nil) then idx[#idx+1] = i end					-- list and sort remaining non-nil indices
		end
		table.sort (idx, function (a,b) return tostring(a) < tostring (b) end)
		for _,j in ipairs (idx) do											-- remaining indices
		  local fmt_idx = (({string = str_idx})[type(j)] or brk_idx) (j)
		  its[#its+1] = fmt_idx .." = ".. val (x[j], depth+1, name..'.'..fmt_idx)
		end
		enc[x] = nil														-- finish encoding this table
		local nl1, nl2 = nl(depth, #idx > 1)								-- indent multiline tables
		return con {'{', nl1, con {con (its, ','..nl1) }, nl2, '}'}			-- put it all together
	  end
	  return val(Lua, 1, '_')
	end

	function ALTUI_LuaRunHandler(lul_request, lul_parameters, lul_outputformat)
		local lua = lul_parameters["lua"]
		luup.log(string.format("ALTUI: runLua(%s)",lua),50)
		printResult = {}
		local errcode = 0
		local f,results = loadstring(lua,"ALTUI - LuaRunHandler")
		if (f==nil) then
			luup.log(string.format("ALTUI: loadstring %s failed to compile, msg=%s",lua,results),1)
		else
			setfenv (f, setmetatable ({ print=myPrint, pretty=pretty}, {__index = _G, __newindex = _G}))
			local ok
				ok, results = pcall (f)	-- call it
				luup.log(string.format("ALTUI: Evaluation of lua code returned: %s",tostring(results)),50)
				errcode=1
		end
		printResult = table.concat (printResult, "\n")
		return string.format("%d||%s||%s",errcode,pretty(results),printResult);
	end
	luup.register_handler('ALTUI_LuaRunHandler','ALTUI_LuaRunHandler')
	]]

	local code2 = [[
		ALTUI = {}
		function ALTUI.notify( pushingbox_DID, str )
			local modurl = require "socket.url"
			-- debug(string.format("ALTUI_notify( %s, %s )",pushingbox_DID, str))
			local newstr = modurl.escape( str or "" )
			luup.inet.wget("http://api.pushingbox.com/pushingbox?devid=" .. pushingbox_DID .. "&value=" .. newstr .. "" )
			return true
		end
		function ALTUI.getWorkflowBagValue( workflowAltuiid, varname )
			local json = require("dkjson")
			local curValue = luup.variable_get("urn:upnp-org:serviceId:altui1", "WorkflowsVariableBag", altui_device)
			local WorkflowsVariableBag	= json.decode( curValue ) or {}
			if (WorkflowsVariableBag[workflowAltuiid] ~= nil) then
				return WorkflowsVariableBag[ workflowAltuiid ] [varname]
			end
			return nil
		end
		function  ALTUI.time_is_between(startTime,endTime)
			local hour = tonumber( startTime:sub( startTime:find("%d+") ) )
			local minute = tonumber(startTime:sub(-2))
			if hour and minute then
				startTime = hour * 100 + minute
			else
				luup.log("ERROR: invalid start time")
				return false
			end
			hour = tonumber( endTime:sub( endTime:find("%d+") ) )
			minute = tonumber(endTime:sub(-2))
			if hour and minute then
				endTime = hour * 100 + minute
			else
				luup.log("ERROR: invalid end time")
				return false
			end
			local currentTime = os.date("*t")
			currentTime = currentTime.hour * 100 + currentTime.min
			--luup.log("startTime = " .. startTime .. "; currentTime = " .. currentTime .. "; endTime = " .. endTime)
			if startTime <= endTime then
				-- Both the start time and the end time are in the same day:
				-- if the current time is in the given interval, run the scene.
				if startTime <= currentTime and currentTime <= endTime then
					return true
				end
			else
				-- The start time is before midnight, and the end time is after midnight:
				-- if the current time is not outside the given interval, run the scene.
				if not (endTime < currentTime and currentTime < startTime) then
					return true
				end
			end
			return false
		end
	]]
	local httpcode,content = loadCode(code,lul_device)
	httpcode,content = loadCode(code2,lul_device)
	return httpcode
end

-- local function testCompress()
	-- log("testCompress()")
	-- local lzw = compress.new "LZW2"
	-- local text = "a test string to compress, a test string to compress, a test string to compress, a test string to compress"
	-- local t = socket.gettime()
	-- local code, D = lzw.encode(text)

	-- log(("time for encode %0.3f (s)"): format (socket.gettime() - t))
	-- log ( ("text: %d, LZW: %d, (%0.1f%%)"): format (#text, #code, #code*100/#text ) )

	-- t = socket.gettime()
	-- local decoded = lzw.decode (code)
	-- log (("time for decode %0.3f (s)"): format (socket.gettime() - t))

	-- assert (decoded == text, "encode/decode loop incorrect")
	-- log "encode/decode loop tested OK!"
-- end

function startupDeferred(lul_device)
	lul_device = tonumber(lul_device)
	log("startupDeferred, called on behalf of device:"..lul_device)
	-- testCompress()
	local debugmode = getSetVariable(ALTUI_SERVICE, "Debug", lul_device, "0")
	local oldversion = getSetVariable(ALTUI_SERVICE, "Version", lul_device, version)
	local url_req = port3480 .. "/data_request?id=lr_ALTUI_Handler&command=home"
	if (isOpenLuup() == true) then
		url_req = "/data_request?id=lr_ALTUI_Handler&command=home"
	end
	local localurl = getSetVariableIfEmpty(ALTUI_SERVICE,"LocalHome", lul_device, url_req)
	local present = getSetVariable(ALTUI_SERVICE,"Present", lul_device, 0)
	-- local remoteurl =getSetVariable(ALTUI_SERVICE,"RemoteAccess", lul_device, "https://remotevera.000webhostapp.com/veralogin.php")
	--local remoteurl =getSetVariable(ALTUI_SERVICE,"RemoteAccess", lul_device, "https://hirwatech.com/veralogin/Veralogin.php")
	local remoteurl =getSetVariable(ALTUI_SERVICE,"RemoteAccess", lul_device, REMOTEACCESS_URL)
	local css = getSetVariable(ALTUI_SERVICE,"ThemeCSS", lul_device, "")
	local imgpath = getSetVariable(ALTUI_SERVICE,"ImagePath", lul_device, "")
	local background = getSetVariable(ALTUI_SERVICE,"BackgroundImg", lul_device, "")
	local extraController= getSetVariable(ALTUI_SERVICE, "ExtraController", lul_device, "")
	local serverOptions= getSetVariable(ALTUI_SERVICE, "ServerOptions", lul_device, "")
	local localcdn = getSetVariable(ALTUI_SERVICE, "LocalCDN", lul_device, "")
	local altuipath = getSetVariable(ALTUI_SERVICE, "ALTUIPath", deviceID, "")
	local localbootstrap = getSetVariable(ALTUI_SERVICE, "LocalBootstrap", lul_device, "")
	local worfklowmode = getSetVariable(ALTUI_SERVICE, "EnableWorkflows", lul_device, "0")
	local worfklowactivestates = getSetVariable(ALTUI_SERVICE, "WorkflowsActiveState", lul_device, "")
	local workflowsVariableBag = json.decode( getSetVariable(ALTUI_SERVICE, "WorkflowsVariableBag", lul_device, "") ) or {}
	local ctrlOptions = getSetVariable(ALTUI_SERVICE, "CtrlOptions", lul_device, "1500,60")
	local api_key = getSetVariable(ALTUI_SERVICE, "VoiceRSS_KEY", lul_device, "")
	local language = getSetVariable(ALTUI_SERVICE, "VoiceRSS_lang", lul_device, "en-us")
	local custompages = getSetVariable(ALTUI_SERVICE, "Data_CustomPages_0", lul_device, "[]")
	local emoncmsurl = getSetVariableIfEmpty(ALTUI_SERVICE, "EmonCmsUrl", lul_device, "https://emoncms.org")
	local pendingReset = getSetVariable(ALTUI_SERVICE, "PendingReset", lul_device, 0)
	local ctrltimeout = getSetVariable(ALTUI_SERVICE, "ControlTimeout", lul_device, DEFAULT_TIMEOUT)

	getSetVariable(ALTUI_SERVICE, "GoogleLastError", lul_device, "")
	-- getSetVariable(ALTUI_SERVICE, "GoogleDeviceCode", lul_device, "")
	-- getSetVariable(ALTUI_SERVICE, "GoogleUserCode", lul_device, "")

	local timers = getSetVariable(ALTUI_SERVICE, "Timers", lul_device, "")

	if (localbootstrap == "") then
		localbootstrap=defaultBootstrapPath
	else
		-- verify this starts by ../ to make sure it works for remote access
		if (string.starts(localbootstrap,"../") == false) then
			if (string.starts(localbootstrap,"/") == false) then
				localbootstrap = ".."..localbootstrap
			else
				localbootstrap = "../"..localbootstrap
			end
			luup.variable_set(ALTUI_SERVICE, "LocalBootstrap", localbootstrap, lul_device)
		end
	end

	if (debugmode=="1") then
		DEBUG_MODE = true
		UserMessage("Enabling debug mode for device:"..lul_device,TASK_BUSY)
	end
	local major,minor = 0,0
	local tbl={}

	if (oldversion~=nil) then
		major,minor = string.match(oldversion,"v(%d+)%.(%d+)")
		major,minor = tonumber(major),tonumber(minor)
		debug ("Plugin version: "..version.." Device's Version is major:"..major.." minor:"..minor)

		newmajor,newminor = string.match(version,"v(%d+)%.(%d+)")
		newmajor,newminor = tonumber(newmajor),tonumber(newminor)
		debug ("Device's New Version is major:"..newmajor.." minor:"..newminor)

		-- force the default in case of upgrade
		if ( (newmajor>major) or ( (newmajor==major) and (newminor>minor) ) ) then
			log ("Version upgrade => Reseting Plugin config to default")
			resetDevice(lul_device,false)
			if (newmajor<1) or ((newmajor == 1) and (newminor <= 1)) then
				setVariableIfChanged(ALTUI_SERVICE, "ServerOptions", "[]", lul_device)
			end
			if (newmajor<1) or ((newmajor == 1) and (newminor <= 2)) then
				fixWatches_V_1_2(lul_device)
			end
		else
			local defconfigjson = json.encode( getDefaultConfig() )
			local config = getSetVariable(ALTUI_SERVICE, "PluginConfig", lul_device, defconfigjson )
		end

		luup.variable_set(ALTUI_SERVICE, "Version", version, lul_device)
	end

	-- init data storages
	_loadDataProviders()
	registerDataProvider("thingspeak","sendValueToStorage_thingspeak",sendValueToStorage_thingspeak, "", {
		[1]		= { ["key"]= "channelid", ["label"]="Channel ID", ["type"]="number" },
		[2]		= { ["key"]= "readkey", ["label"]="Read API Key", ["type"]="text" },
		[3]		= { ["key"]= "writekey", ["label"]="Write API Key", ["type"]="text" },
		[4]		= { ["key"]= "fieldnum", ["label"]="Field Number", ["type"]="number", ["default"]=1 },
		[5]		= { ["key"]= "graphicurl", ["label"]="Graphic Url", ["type"]="url" , ["default"]="//api.thingspeak.com/channels/{0}/charts/{3}?key={1}&width=450&height=260&results=60&dynamic=true"}
	})

	registerDataProvider("emoncms","sendValueToStorage_emoncms",sendValueToStorage_emoncms, "", {
		[1]		= { ["key"]= "nodeid", ["label"]="Node ID", ["type"]="number" ,["default"]=1},
		[2]		= { ["key"]= "feedid", ["label"]="Feed ID", ["type"]="number" },
		[3]		= { ["key"]= "inputkey", ["label"]="Input Key name", ["type"]="text" },
		[4]		= { ["key"]= "readwritekey", ["label"]="Read/Write API Key", ["type"]="text" },
		[5]		= { ["key"]= "graphicurl", ["label"]="Graphic Url", ["type"]="url", ["ifheight"]=460, ["default"]=emoncmsurl .. "/vis/realtime?feedid={1}&embed=1&apikey={3}"}
	})

	registerDataProvider("IFTTT","sendValueToStorage_ifttt",sendValueToStorage_ifttt, "", {
		[1]		= { ["key"]= "webhookkey", ["label"]="Web Hook Key", ["type"]="text" },
		[2]		= { ["key"]= "eventname", ["label"]="Hook Event Name", ["type"]="text" ,["default"]="vera_data_published"},
	})

	-- registerDataProvider("Test - not functional",sendValueToStorage_toto,"", {
		-- [1]	= { ["key"]= "toto", ["label"]="To To", ["type"]="text" },
		-- [2]	= { ["key"]= "graphicurl", ["label"]="Graphic Url", ["type"]="url" , ["default"]="//www.google.com/{0}"}
	-- })

	-- init watches
	fixVariableWatchesDeviceID( lul_device )
	initVariableWatches( lul_device )

	-- init timers
	initTimers(lul_device)

	-- init Workflows
	enableWorkflows( lul_device,worfklowmode,pendingReset )	-- will trigger start if mode is true

	-- start handlers
	registerHandlers(lul_device)

	-- process old timers
	processTimers(lul_device)

	-- clear the RESET flag
	luup.variable_set(ALTUI_SERVICE, "PendingReset", 0, lul_device)

	-- create folder if needed and clear the tmp files
	os.execute("mkdir -p /www/altui ; rm /www/altui/altui*")
	
	-- NOTHING to start
	if( luup.version_branch == 1 and luup.version_major == 7) then
		luup.set_failure(0,lul_device)	-- should be 0 in UI7
	else
		luup.set_failure(false,lul_device)	-- should be 0 in UI7
	end
	log("startup completed")
end

function initstatus(lul_device)
	lul_device = tonumber(lul_device)
	this_device = lul_device
	log("initstatus("..lul_device..") starting version: "..version)
	if (isOpenLuup() == true) then
		port3480 = ":3480"
	end
	checkVersion(lul_device)
	hostname = getIP()
	local delay = 1		-- delaying first refresh by x seconds
	debug("initstatus("..lul_device..") startup for Root device, delay:"..delay)

	-- almost random seed
	math.randomseed( os.time() )
	luup.call_delay("startupDeferred", delay, tostring(lul_device))
end

-- do not delete, last line must be a CR according to MCV wiki page
