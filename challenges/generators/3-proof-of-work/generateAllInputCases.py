import random
from boostHashTools import getBoostCodeChar, findNonce, getBoostHash
import os

inputSize = 100
contentsLengthMin = 30
contentsLengthMax = 40
boostCodeIntMax = 32-1 # fixed value

def makeDirIfNotExists(dir):
  if not os.path.exists(dir):
    os.makedirs(dir)

contentsSet = set()
while (len(contentsSet) < inputSize):
  contentsLength = random.randint(contentsLengthMin, contentsLengthMax)
  contentsBuffer = [getBoostCodeChar(random.randint(0, boostCodeIntMax)) for _ in range(contentsLength)]
  contents = ''.join(contentsBuffer)

  nonce = findNonce(contents)
  if nonce != '' and int(nonce) > 13000: # select not-too-easy, not-too-hard input
    contentsSet.add((contents, nonce))

    if len(contentsSet) % 10 == 0:
      print(len(contentsSet), 'contents generated')

contentsList = list(contentsSet)
for i in range(inputSize):
  contents, nonce = contentsList[i]

  fileIndex = str(i+1) # zero-based to one-based

  makeDirIfNotExists('inputs')
  f = open('inputs/' + fileIndex + '.txt', 'w')
  f.write(contents)
  f.close()

  makeDirIfNotExists('answers/31')
  answer1 = getBoostHash(contents)
  f = open('answers/31/' + fileIndex + '.txt', 'w')
  f.write(str(answer1))
  f.close()

  makeDirIfNotExists('answers/32')
  f = open('answers/32/' + fileIndex + '.txt', 'w')
  f.write(nonce)
  f.close()
