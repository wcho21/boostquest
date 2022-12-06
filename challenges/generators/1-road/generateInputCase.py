import random
import functools
import os

def generateRoad(difficulty):
  levels = []
  start = random.randint(1, 9)

  levels.append(start)
  
  diffToConsume = 0
  remainingDiff = difficulty

  # randomly determine each road level
  while remainingDiff > 0:
    if remainingDiff == 1:
      diffToConsume = 1
    elif remainingDiff == 2 and levels[-1] == 1:
      diffToConsume = 1
    elif remainingDiff == 2 and levels[-1] > 1:
      diffToConsume = random.randint(1, 2)
    elif remainingDiff >= 3 and levels[-1] == 1:
      diffToConsume = random.choice([1, 3])
    elif remainingDiff >= 3 and levels[-1] == 9:
      diffToConsume = random.randint(1, 2)
    else:
      diffToConsume = random.randint(1, 3)

    remainingDiff -= diffToConsume

    if diffToConsume == 1:
      levels.append(levels[-1])
    elif diffToConsume == 2:
      levels.append(levels[-1] - 1)
    elif diffToConsume == 3:
      levels.append(levels[-1] + 1)
    else:
      raise Exception('diff is not between 1, 3')

  road = ''.join([str(i) for i in levels])
  return road

# problem 2 answer
def countDuplicates(road):
  prevLevel = '0'
  count = 0
  for level in list(road):
    if prevLevel == level:
      count += 1
    prevLevel = level
  return count

def makeDirIfNotExists(dir):
  if not os.path.exists(dir):
    os.makedirs(dir)

def generateInputCase(inputLineSize, fileIndex):
  # initialize difficulties
  difficulties = []

  minDifficulty = random.randint(1001, 1999)
  difficulties.append(minDifficulty)

  while (len(difficulties) < inputLineSize):
    rand = random.randint(1001, 2999)
    if (rand > minDifficulty):
      difficulties.append(rand)

  random.shuffle(difficulties)
  answerDiffsIndex = difficulties.index(minDifficulty)

  # write input files
  roads = list(map(generateRoad, difficulties))
  answerRoad = roads[answerDiffsIndex]
  inputText = '\n'.join(roads)

  fileIndex = str(fileIndex)

  makeDirIfNotExists('inputs')
  f = open('inputs/' + fileIndex + '.txt', 'w')
  f.write(inputText)
  f.close()

  makeDirIfNotExists('answers/11')
  f = open('answers/11/' + fileIndex + '.txt', 'w')
  answer = functools.reduce(lambda x, y: x + y, [int(s) for s in answerRoad], 0)
  f.write(str(answer))
  f.close()

  makeDirIfNotExists('answers/12')
  f = open('answers/12/' + fileIndex + '.txt', 'w')
  answer2 = countDuplicates(answerRoad)
  f.write(str(answer2))
  f.close()

  # difficulty for each input line
  makeDirIfNotExists('debug')
  f = open('debug/' + fileIndex + '.txt', 'w')
  diffLines = '\n'.join([str(d) for d in difficulties])
  f.write(diffLines)
  f.close()
