import random
from generateInputCase import generateInputCase, isBecomeZeroUntilTurn

startNumbers = set()
inputCasesNum = 100
iterCount = 99
while len(startNumbers) < inputCasesNum:
  startNumber = random.randint(150000, 999999)
  if isBecomeZeroUntilTurn(startNumber, iterCount+5):
    continue
  startNumbers.add(startNumber)

for i, num in enumerate(startNumbers, 1):
  fileIndex = str(i)
  generateInputCase(num, iterCount, fileIndex)

