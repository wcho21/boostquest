from functools import reduce
import os

def getDiff(road):
  diff = 0
  i = 1
  while i < len(road):
    cur = int(road[i])
    prev = int(road[i-1])
    if prev > cur:
      diff += 2
    elif prev < cur:
      diff += 3
    else:
      diff += 1

    i += 1
  
  return diff

def getEvenness(road):
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

for i in range(1, 100 + 1):
  idx = str(i)
  makeDirIfNotExists('inputs')
  f = open('inputs/' + idx + '.txt', 'r')
  inputText = f.read().split('\n')

  diffs = list(map(getDiff, inputText))
  debugText = '\n'.join(map(str, diffs))

  makeDirIfNotExists('solve_debug')
  f = open('solve_debug/' + idx + '.txt', 'w')
  f.write(debugText)
  f.close()

  answerDiff = min(diffs)
  answerIdx = diffs.index(answerDiff)
  answerRoad = inputText[answerIdx]
  answer = reduce(lambda x, y: x + y, list(map(int, list(answerRoad))), 0)
  
  makeDirIfNotExists('solve_answers/11')
  f = open('solve_answers/11/' + idx + '.txt', 'w')
  f.write(str(answer))
  f.close()

  makeDirIfNotExists('solve_answers/12')
  answer2 = getEvenness(answerRoad)
  f = open('solve_answers/12/' + idx + '.txt', 'w')
  f.write(str(answer2))
  f.close()
