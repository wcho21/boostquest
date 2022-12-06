def convertCharToBoostCode(char):
  num = ord(char)
  if 97 <= num < 123:
    zero_based = num - 97
    return zero_based # 0 to 25
  if 48 <= num < 58:
    zero_based = num - 48
    return zero_based + 26 # 26 to 35

def getBoostCodeChar(bits):
  if 0 <= bits < 26:
    return chr(bits + 97)
  if 26 <= bits < 32:
    return chr(bits - 26 + 48)
  raise Exception('bad bits', bits)

def encodeBoost40(bits):
  a = (bits >> 35) & 0b11111
  b = (bits >> 30) & 0b11111
  c = (bits >> 25) & 0b11111
  d = (bits >> 20) & 0b11111
  e = (bits >> 15) & 0b11111
  f = (bits >> 10) & 0b11111
  g = (bits >> 5) & 0b11111
  h = bits & 0b11111

  return ''.join(map(getBoostCodeChar, [a, b, c, d, e, f, g, h]))

def getBoostHash(char):
  chars = list(char)
  prod = 0

  for c in char:
    num = convertCharToBoostCode(c)
    prod += 13005196351
    prod *= (num + 91)

    # print(c, bin(prod), len(bin(prod))-2, prod)
    prod &= 0b11111_11111_11111_11111_11111_11111_11111_11111
    # print(c, bin(prod), len(bin(prod))-2, prod)

    # shift
    msb = prod & 0b11111_11111
    prod >>= 10
    prod |= (msb << 30)
    # print(c, bin(prod), len(bin(prod))-2, prod)
  
  hash = encodeBoost40(prod)
  return hash

def findNonce(contents):
  maxTries = 130_000
  powPrefix = 'bst'
  
  for nonce in range(1, maxTries):
    nonce = str(nonce)
    toHash = nonce + contents
    hash = getBoostHash(toHash)
    if (hash[:3] == powPrefix):
      return nonce
  return '' # cannot find
