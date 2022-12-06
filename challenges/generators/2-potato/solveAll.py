import os

def getNext(num):
  if num % 2 == 1:
    return num * 3 + 1
  return int(num / 2)

def iterate(startNum, turns):
  num = startNum
  for _ in range(turns):
    num = getNext(num)
  return num

def findWhenFirstOne(startNum):
  count = 1
  num = startNum
  while num != 1:
    num = getNext(num)
    count += 1
  return count

def makeDirIfNotExists(dir):
  if not os.path.exists(dir):
    os.makedirs(dir)

for i in range(1, 100 + 1):
  fileIndex = str(i)
  makeDirIfNotExists('inputs')
  f = open('inputs/' + fileIndex + '.txt', 'r')
  inputNum = int(f.read())

  makeDirIfNotExists('solve_answers/21')
  answer1 = iterate(inputNum, 99)
  f = open('solve_answers/21/' + fileIndex + '.txt', 'w')
  f.write(str(answer1))
  f.close()

  makeDirIfNotExists('solve_answers/22')
  answer2 = findWhenFirstOne(inputNum)
  f = open('solve_answers/22/' + fileIndex + '.txt', 'w')
  f.write(str(answer2))
  f.close()
