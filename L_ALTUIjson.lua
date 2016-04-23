module("L_ALTUIjson",package.seeall)
--@amg0
--modified version which works with module declaration. reason is probably because of deployment in mios store options (lua) which I cannot change now
-- 
------------------------------------------------------------------------
-- David Kolf's JSON module for Lua 5.1/5.2
-- Version 1.2
--
-- This module writes no global values of itself, not even the module
-- table. Import it using
--   json = require ("dkjson")
--
-- Exported functions and values:
-- json.null
--   You can use this value for setting explicit 'null' values.
--
-- json.encode (object [, state])
--   Create a string representing the object. 'Object' can be a table,
--   a string, a number, a boolean, nil, json.null or any object with
--   a function __tojson in its metatable. A table can only use strings
--   and numbers as keys and its values have to be valid objects as
--   well. It will return an error message for any invalid data types or
--   reference cycles.
--
--   'state' is an optional table with the following fields:
--   - indent
--     When 'indent' (a boolean) is set, the created string will contain
--     newlines and indentations. Otherwise it will be one long line.
--   - level
--     This is the level of indentation used when 'indent' is set. For
--     each level two spaces are added. When absent it is set to 0.
--   - buffer
--     'buffer' is an array to store the strings for the result so they
--     can be concatenated at once. When it isn't given, the encode
--     function will create it temporary and will return the
--     concatenated result.
--   - bufferlen
--     When 'bufferlen' is set, it has to be the index of the last
--     element of 'buffer'.
--   - tables
--     'tables' is a set to detect reference cycles. It is created
--     temporary when absent. Every table that is currently processed
--     is used as key, the value is 'true'.
--
--   When state.buffer was set, the return value will be true on
--   success. Without state.buffer the return value will be a string.
--   In case of errors nil and an error message will be returned.
--
-- json.decode (string [, position [, null]])
--   Decode 'string' starting at 'position' or at 1 if 'position' was
--   omitted.
--
--   'null' is an optional value to be returned for null values. The
--   default is 'nil', but you could set it to json.null or any other
--   value.
--
--   The return values are the object or nil, the position of the next
--   character that doesn't belong to the object, and in case of errors
--   an error message.
--
-- <metatable>.__tojson (self, state)
--   You can provide your own __tojson function in a metatable. In this
--   function you can either add directly to the buffer and return true,
--   or you can return a string. On errors nil and a message should be
--   returned.
--
-- json.quotestring (string)
--   Quote a UTF-8 string and escape critical characters using JSON
--   escape sequences. This function is only necessary when you build
--   your own __tojson functions.
--
-- json.addnewline (state)
--   When state.indent is set, add a newline to state.buffer and spaces
--   according to state.level. When state.indent isn't set, only a
--   single space is added.
--
-- You can contact the author by sending an e-mail to 'david' at the
-- domain 'dkolf.de'.
--
-- Copyright (C) 2010-2013 David Heiko Kolf
--
-- Permission is hereby granted, free of charge, to any person obtaining
-- a copy of this software and associated documentation files (the
-- "Software"), to deal in the Software without restriction, including
-- without limitation the rights to use, copy, modify, merge, publish,
-- distribute, sublicense, and/or sell copies of the Software, and to
-- permit persons to whom the Software is furnished to do so, subject to
-- the following conditions:
--
-- The above copyright notice and this permission notice shall be
-- included in all copies or substantial portions of the Software.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
-- EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
-- MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
-- NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
-- BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
-- ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
-- CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
-- SOFTWARE.

-- global dependencies:
local pairs, type, tostring, tonumber, getmetatable, setmetatable =
      pairs, type, tostring, tonumber, getmetatable, setmetatable
local require, pcall = require, pcall
local floor, huge = math.floor, math.huge
local strrep, gsub, strsub, strbyte, strchar, strfind, strlen, strformat =
      string.rep, string.gsub, string.sub, string.byte, string.char,
      string.find, string.len, string.format
local concat = table.concat

local _ENV = nil -- blocking globals in Lua 5.2

local json = { version = "dkjson 1.2" }

pcall (function()
	-- Enable access to blocked metatables.
	-- Don't worry, this module doesn't change anything in them.
	local debmeta = require "debug".getmetatable
	if debmeta then getmetatable = debmeta end
end)

null = setmetatable ({}, {__tojson = function () return "null" end})

local function isarray (tbl)
	local max, n = 0, 0
	for k,v in pairs (tbl) do
		if k == "n" then
			if v ~= #tbl then
				return false
			end
		else
			if type(k) ~= "number" or k < 1 or floor(k) ~= k then
				return false
			end
			if k > max then
					max = k
			end
			n = n + 1
		end
	end
	if max > 10 and max > n * 2 then
		return false -- don't create an array with too many holes
	end
	return true, max
end

local escapecodes = {
	["\""] = "\\\"", ["\\"] = "\\\\", ["\b"] = "\\b", ["\f"] = "\\f",
	["\n"] = "\\n",  ["\r"] = "\\r",  ["\t"] = "\\t"
}

local function escapeutf8 (uchar)
	local value = escapecodes[uchar]
	if value then
		return value
	end
	local a, b, c, d = strbyte (uchar, 1, 4)
	a, b, c, d = a or 0, b or 0, c or 0, d or 0
	if a <= 0x7f then
		value = a
	elseif 0xc0 <= a and a <= 0xdf and b >= 0x80 then
		value = (a - 0xc0) * 0x40 + b - 0x80
	elseif 0xe0 <= a and a <= 0xef and b >= 0x80 and c >= 0x80 then
		value = ((a - 0xe0) * 0x40 + b - 0x80) * 0x40 + c - 0x80
	elseif 0xf0 <= a and a <= 0xf7 and b >= 0x80 and c >= 0x80 and d >= 0x80 then
		value = (((a - 0xf0) * 0x40 + b - 0x80) * 0x40 + c - 0x80) * 0x40 + d - 0x80
	else
		return ""
	end
	if value <= 0xffff then
		return strformat ("\\u%.4x", value)
	elseif value <= 0x10ffff then
		-- encode as UTF-16 surrogate pair
		value = value - 0x10000
		local highsur, lowsur = 0xD800 + floor (value/0x400), 0xDC00 + (value % 0x400)
		return strformat ("\\u%.4x\\u%.4x", highsur, lowsur)
	else
		return ""
	end
end

local function fsub (str, pattern, repl)
	-- gsub always builds a new string in a buffer, even when no match
	-- exists. First using find should be more efficient when most strings
	-- don't contain the pattern.
	if strfind (str, pattern) then
		return gsub (str, pattern, repl)
	else
		return str
	end
end

local function quotestring (value)
	-- based on the regexp "escapable" in https://github.com/douglascrockford/JSON-js
	value = fsub (value, "[%z\1-\31\"\\\127]", escapeutf8)
	if strfind (value, "[\194\216\220\225\226\239]") then
		value = fsub (value, "\194[\128-\159\173]", escapeutf8)
		value = fsub (value, "\216[\128-\132]", escapeutf8)
		value = fsub (value, "\220\143", escapeutf8)
		value = fsub (value, "\225\158[\180\181]", escapeutf8)
		value = fsub (value, "\226\128[\140-\143\168-\175]", escapeutf8)
		value = fsub (value, "\226\129[\160-\175]", escapeutf8)
		value = fsub (value, "\239\187\191", escapeutf8)
		value = fsub (value, "\239\191[\176-\191]", escapeutf8)
	end
	return "\"" .. value .. "\""
end
-- json.quotestring = quotestring

local function addnewline2 (indent, level, buffer, buflen)
	if indent then
		buffer[buflen+1] = "\n"
		buffer[buflen+2] = strrep ("  ", level)
		buflen = buflen + 2
		return buflen
	else
		buflen = buflen + 1
		buffer[buflen] = " "
		return buflen
	end
end

function addnewline (state)
	state.bufferlen = addnewline2 (state.indent, state.level or 0,
	                       state.buffer, state.bufferlen or #(state.buffer))
end

local function encode2 (value, indent, level, buffer, buflen, tables)
	local valtype = type (value)
	local valmeta = getmetatable (value)
	local valtojson = type (valmeta) == "table" and valmeta.__tojson
	if valtojson then
		if tables[value] then
			return nil, "reference cycle"
		end
		tables[value] = true
		local state = {
			indent = indent, level = level, buffer = buffer,
			bufferlen = buflen, tables = tables
		}
		local ret, msg = valtojson (value, state)
		if not ret then return nil, msg end
		tables[value] = nil
		buflen = state.bufferlen
		if type (ret) == "string" then
			buflen = buflen + 1
			buffer[buflen] = ret
		end
	elseif value == nil then
		buflen = buflen + 1
		buffer[buflen] = "null"
	elseif valtype == "number" then
		local s
		if value ~= value or value >= huge or -value >= huge then
			-- This is the behaviour of the original JSON implementation.
			s = "null"
		else
			s = tostring (value)
		end
		buflen = buflen + 1
		buffer[buflen] = s
	elseif valtype == "boolean" then
		buflen = buflen + 1
		buffer[buflen] = tostring (value)
	elseif valtype == "string" then
		buflen = buflen + 1
		buffer[buflen] = quotestring (value)
	elseif valtype == "table" then
		if tables[value] then
			return nil, "reference cycle"
		end
		tables[value] = true
		level = level + 1
		local isa, n = isarray (value)
		local msg
		if isa then -- JSON array
			buflen = buflen + 1
			buffer[buflen] = "[ "
			for i = 1, n do
				buflen, msg = encode2 (value[i], indent, level, buffer, buflen, tables)
				if not buflen then return nil, msg end
				if i < n then
					buflen = buflen + 1
					buffer[buflen] = ", "
				end
			end
			buflen = buflen + 1
			buffer[buflen] = " ]"
		else -- JSON object
			local prev = false
			buflen = buflen + 1
			buffer[buflen] = "{"
			for k,v in pairs (value) do
				local kt = type (k)
				if kt ~= "string" and kt ~= "number" then
					return nil, "type '" .. kt .. "' is not supported as a key by JSON."
				end
				if prev then
					buflen = buflen + 1
					buffer[buflen] = ","
				end
				buflen = addnewline2 (indent, level, buffer, buflen)
				buffer[buflen+1] = quotestring (k)
				buffer[buflen+2] = ": "
				buflen = buflen + 2
				buflen, msg = encode2 (v, indent, level, buffer, buflen, tables)
				if not buflen then return nil, msg end
				prev = true -- add a seperator before the next element
			end
			buflen = addnewline2 (indent, level - 1, buffer, buflen)
			buflen = buflen + 1
			buffer[buflen] = "}"
		end
		tables[value] = nil
	else
		return nil, "type '" .. valtype .. "' is not supported by JSON."
	end
	return buflen
end

function encode (value, state)
	state = state or {}
	local oldbuffer = state.buffer
	local buffer = oldbuffer or {}
	local ret, msg = encode2 (value, state.indent, state.level or 0,
	                          buffer, state.bufferlen or 0, state.tables or {})
	if not ret then
		return nil, msg
	elseif oldbuffer then
		state.bufferlen = ret
		return true
	else
		return concat (buffer)
	end
end

local function loc (str, where)
	local line, pos, linepos = 1, 1, 0
	while true do
		pos = strfind (str, "\n", pos, true)
		if pos and pos < where then
			line = line + 1
			linepos = pos
			pos = pos + 1
		else
			break
		end
	end
	return "line " .. line .. ", column " .. (where - linepos)
end

local function unterminated (str, what, where)
	return nil, strlen (str) + 1, "unterminated " .. what .. " at " .. loc (str, where)
end

local function scanwhite (str, pos)
	while true do
		pos = strfind (str, "%S", pos)
		if not pos then return nil end
		if strsub (str, pos, pos + 2) == "\239\187\191" then
			-- UTF-8 Byte Order Mark
			pos = pos + 3
		else
			return pos
		end
	end
end

local escapechars = {
	["b"] = "\b", ["f"] = "\f",
	["n"] = "\n", ["r"] = "\r", ["t"] = "\t"
}

local function unichar (value)
	if value < 0 then
		return nil
	elseif value <= 0x007f then
		return strchar (value)
	elseif value <= 0x07ff then
		return strchar (0xc0 + floor(value/0x40),
		                0x80 + (floor(value) % 0x40))
	elseif value <= 0xffff then
		return strchar (0xe0 + floor(value/0x1000),
		                0x80 + (floor(value/0x40) % 0x40),
		                0x80 + (floor(value) % 0x40))
	elseif value <= 0x10ffff then
		return strchar (0xf0 + floor(value/0x40000),
		                0x80 + (floor(value/0x1000) % 0x40),
		                0x80 + (floor(value/0x40) % 0x40),
		                0x80 + (floor(value) % 0x40))
	else
		return nil
	end
end

local function scanstring (str, pos)
	local lastpos = pos + 1
	local buffer, n = {}, 0
	while true do
		local nextpos = strfind (str, "[\"\\]", lastpos)
		if not nextpos then
			return unterminated (str, "string", pos)
		end
		if nextpos > lastpos then
			n = n + 1
			buffer[n] = strsub (str, lastpos, nextpos - 1)
		end
		if strsub (str, nextpos, nextpos) == "\"" then
			lastpos = nextpos + 1
			break
		else
			local escchar = strsub (str, nextpos + 1, nextpos + 1)
			local value
			if escchar == "u" then
				value = tonumber (strsub (str, nextpos + 2, nextpos + 5), 16)
				if value then
					local value2
					if 0xD800 <= value and value <= 0xDBff then
						-- we have the high surrogate of UTF-16. Check if there is a
						-- low surrogate escaped nearby to combine them.
						if strsub (str, nextpos + 6, nextpos + 7) == "\\u" then
							value2 = tonumber (strsub (str, nextpos + 8, nextpos + 11), 16)
							if value2 and 0xDC00 <= value2 and value2 <= 0xDFFF then
								value = (value - 0xD800)  * 0x400 + (value2 - 0xDC00) + 0x10000
							else
								value2 = nil -- in case it was out of range for a low surogate
							end
						end
					end
					value = value and unichar (value)
					if value then
						if value2 then
							lastpos = nextpos + 12
						else
							lastpos = nextpos + 6
						end
					end
				end
			end
			if not value then
				value = escapechars[escchar] or escchar
				lastpos = nextpos + 2
			end
			n = n + 1
			buffer[n] = value
		end
	end
	if n == 1 then
		return buffer[1], lastpos
	elseif n > 1 then
		return concat (buffer), lastpos
	else
		return "", lastpos
	end
end

local scanvalue -- forward declaration

local function scantable (what, closechar, str, startpos, nullval)
	local len = strlen (str)
	local tbl, n = {}, 0
	local pos = startpos + 1
	while true do
		pos = scanwhite (str, pos)
		if not pos then return unterminated (str, what, startpos) end
		local char = strsub (str, pos, pos)
		if char == closechar then
			return tbl, pos + 1
		end
		local val1, err
		val1, pos, err = scanvalue (str, pos, nullval)
		if err then return nil, pos, err end
		pos = scanwhite (str, pos)
		if not pos then return unterminated (str, what, startpos) end
		char = strsub (str, pos, pos)
		if char == ":" then
			if val1 == nil then
				return nil, pos, "cannot use nil as table index (at " .. loc (str, pos) .. ")"
			end
			pos = scanwhite (str, pos + 1)
			if not pos then return unterminated (str, what, startpos) end
			local val2
			val2, pos, err = scanvalue (str, pos, nullval)
			if err then return nil, pos, err end
			tbl[val1] = val2
			pos = scanwhite (str, pos)
			if not pos then return unterminated (str, what, startpos) end
			char = strsub (str, pos, pos)
		else
			n = n + 1
			tbl[n] = val1
		end
		if char == "," then
			pos = pos + 1
		end
	end
end

scanvalue = function (str, pos, nullval)
	pos = pos or 1
	pos = scanwhite (str, pos)
	if not pos then
		return nil, strlen (str) + 1, "no valid JSON value (reached the end)"
	end
	local char = strsub (str, pos, pos)
	if char == "{" then
		return scantable ("object", "}", str, pos, nullval)
	elseif char == "[" then
		return scantable ("array", "]", str, pos, nullval)
	elseif char == "\"" then
		return scanstring (str, pos)
	else
		local pstart, pend = strfind (str, "^%-?[%d%.]+[eE]?[%+%-]?%d*", pos)
		if pstart then
			local number = tonumber (strsub (str, pstart, pend))
			if number then
				return number, pend + 1
			end
		end
		pstart, pend = strfind (str, "^%a%w*", pos)
		if pstart then
			local name = strsub (str, pstart, pend)
			if name == "true" then
				return true, pend + 1
			elseif name == "false" then
				return false, pend + 1
			elseif name == "null" then
				return nullval, pend + 1
			end
		end
		return nil, pos, "no valid JSON value at " .. loc (str, pos)
	end
end

decode = scanvalue

