import random
import os

def getNextNumber(curNumber):
  if curNumber <= 0:
    raise Exception('Not a valid number', curNumber)

  if curNumber % 2 == 1:
    return curNumber * 3 + 1
  return int(curNumber / 2)

def doIteration(startNumber, iterCount):
  num = startNumber
  for i in range(iterCount):
    num = getNextNumber(num)
  
  return num

def isBecomeZeroUntilTurn(startNumber, turn):
  num = startNumber
  for i in range(turn):
    num = getNextNumber(num)
    if num == 1:
      return True
  return False

def findTurnWhenBecomeOneFirst(startNumber):
  count = 1 # since first turn is given by 1
  num = startNumber
  while num > 1:
    num = getNextNumber(num)
    count += 1
  
  return count

def makeDirIfNotExists(dir):
  if not os.path.exists(dir):
    os.makedirs(dir)

def generateInputCase(startNumber, iterCount, fileIndex):
  fileIndex = str(fileIndex)

  makeDirIfNotExists('inputs')
  f = open('inputs/' + fileIndex + '.txt', 'w')
  f.write(str(startNumber))
  f.close()

  makeDirIfNotExists('answers/21')
  answer1 = doIteration(startNumber, iterCount)
  f = open('answers/21/' + fileIndex + '.txt', 'w')
  f.write(str(answer1))
  f.close()

  makeDirIfNotExists('answers/22')
  answer2 = findTurnWhenBecomeOneFirst(startNumber)
  f = open('answers/22/' + fileIndex + '.txt', 'w')
  f.write(str(answer2))
  f.close()
