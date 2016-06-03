module ("L_ALTUI_LuaRunHandler", package.seeall)
--
-- Data compression 
--
-- LZW algorithm with two bytes per code
-- @akbooer  May 2016
--
-- note that ASCII printable characters are 0x20 - 0x7E (0x7F is 'delete')
-- note that XML quoted characters are: < > " ' &
-- note that JSON quoted printable characters are: " \ /


function new (header)
  header = header or ''
  local code_alphabet = -- this one is the unescaped JSON character set
    [==[ !#$%&'()*+,-.0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~]==]
  
  local CA = #code_alphabet
  local LSB, MSB = {}, {}
  local code_dict = {}
  for i = 1, CA do 
    local j = i - 1
    local c = code_alphabet: sub(i,i)
    code_dict[j] = c 
    LSB[c] = j
    MSB[c] = CA * j
  end
  
  local DICTIONARY_SIZE = CA * CA - 1   -- we are using two code letters per code
  
  local function dictionary (N)    -- bi-directional lookup
    local dict = {}
    for i = 0,N or 0xFF do 
      local ch = string.char(i)
      dict[ch] = i 
      dict[i] = ch
    end
    return dict
  end


  -- encode ()
  local function lzw (text)
    local dict = dictionary ()   -- put all possible source code characters into the dictionary
    local code = {}
    code[#code+1] = header      -- good idea to have a header which identifies the encoding used
      
    -- given a word, look up code and output to encoded stream
    local function encode (word)
      local n = dict[word]                  -- it IS in the dictionary
      local lsb = n % CA                    -- lsb range is 0 .. CA-1
      local msb = math.floor (n / CA)       -- msb ditto
      code[#code+1] = code_dict[lsb]
      code[#code+1] = code_dict[msb]
    end
    
    local word = ''
    local m = 1
    for n = 1,#text do
      local new = text: sub(m,n)
      if not dict[new] then
        local N = #dict
        if N < DICTIONARY_SIZE then -- else, just stick with the dictionary we have
          dict[new] = N + 1
          dict[N + 1] = new
        end
        encode (word)
        new = text:sub(n,n)
        m = n
      end
      word = new
    end
    encode (word)
    return table.concat(code), dict
  end


  local function unlzw (code)
    local dict = dictionary ()
    local N = #dict

    local text = {}
    
    local function decode (pos)
      local lsb = code: sub(pos,pos)
      local msb = code: sub (pos+1, pos+1)
      return MSB[msb] + LSB[lsb]
    end
    
    assert (code: sub(1, #header) == header)
    local prev  = decode (1+#header)
    text = {dict[prev]}
    
    for n = 3+#header, #code, 2 do 
      local key = decode (n)
      local c
      local word = dict[key]
      if word then
        c = word:sub (1,1)
        text[#text+1] = word
      else
        local prevWord = dict[prev]
        c = prevWord: sub(1,1)
        text[#text+1] = prevWord .. c
      end
      
      if N < DICTIONARY_SIZE then
        N = N + 1
        dict[N] = dict[prev] .. c 
      end
      prev = key
    end
    return table.concat (text)
  end
  
  return {
    encode = lzw,
    decode = unlzw,
  }
  

-----
--
-- TEST
--

--local lzw = new "LZW0"
--local T = [[
--The rain it raineth on the just 
--And also on the unjust fella;
--But chiefly on the just, because
--The unjust hath the just’s umbrella.
--]]
--local text = T:rep(1000)

--local code,dict = lzw.encode (text)
--print (#text, #code, math.floor(#code * 100 / #text))
--print ("code:")
--print (code)

--local decode = lzw.decode (code)

--assert (decode == text)

--print "encode/decode loop tested OK!"

-- return {new = new}

-----
end

