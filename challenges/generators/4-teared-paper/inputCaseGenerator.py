import random
import os

def getRandomAlphabet():
  integer = random.randint(0, 25)
  return chr(integer+97) # a to z

def generateSide(sideLength):
  randomAlphabets = [getRandomAlphabet() for _ in range(sideLength)]
  side = ''.join(randomAlphabets)

  return side

def generateSquares(numOfSquares, sideLength):
  numOfSides = 3 * numOfSquares + 1

  sidesSet = set()
  while len(sidesSet) < numOfSides:
    side = generateSide(sideLength)
    if (side in sidesSet):
      continue
    
    sidesSet.add(side)
  sides = list(sidesSet)
  # left top bottom right (and left of next square) top bottom right (and left of next square) ...

  squares = []
  for i in range(numOfSquares):
    leftSideIdx = 3 * i
    topSideIdx = 3 * i + 1
    bottomSideIdx = 3 * i + 2
    rightSideIdx = 3 * i + 3

    leftSide = sides[leftSideIdx][::-1]
    topSide = sides[topSideIdx]
    bottomSide = sides[bottomSideIdx]
    rightSide = sides[rightSideIdx]

    squares.append([topSide, rightSide, bottomSide, leftSide])

  return squares

def randomlyRotateSquare(square):
  numOfRotation = random.randint(0, 3)

  for _ in range(numOfRotation):
    square = [square[-1]] + square[:-1]

  return square

def getPrimes(numOfPrimes):
  primes = [
    13, 17, 19, 23, 29,
    31, 37, 41, 43, 47,
    53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
    101, 103, 107, 109, 113,
    127, 131, 137, 139, 149,
    151, 157, 163, 167, 173
  ]

  if len(primes) < numOfPrimes:
    raise Exception('Too many prime numbers requested')

  return primes[:numOfPrimes]

def drawSqauresAndPrimes(squares, primes, sideLength, indexOrder):
  linesBuffer = [[] for _ in range(sideLength+2)]

  for i in indexOrder:
    square = squares[i]
    prime = primes[i]

    topSide = square[0]
    rightSide = square[1]
    bottomSide = square[2]
    leftSide = square[3]

    primeNumberLineIdx = int((len(leftSide)+2) / 2)

    # draw top sides
    linesBuffer[0].append(' ')
    linesBuffer[0].append(topSide)
    linesBuffer[0].append(' ')

    # draw left side
    for j, char in enumerate(list(leftSide[::-1]), 1):
      linesBuffer[j].append(char)
      if j != primeNumberLineIdx:
        linesBuffer[j].append(' ' * len(topSide))
      else:
        linesBuffer[j].append(' ' + str(prime).ljust(len(leftSide)-2) + ' ')
    
    # draw right side
    for j, char in enumerate(list(rightSide), 1):
      linesBuffer[j].append(char)

    # draw bottom sides
    linesBuffer[-1].append(' ')
    linesBuffer[-1].append(bottomSide[::-1])
    linesBuffer[-1].append(' ')
    
    # draw margin
    for j in range(len(leftSide)+2):
      linesBuffer[j].append(' ')

  lines = '\n'.join(map(lambda line: ''.join(line), linesBuffer))
  return lines

def generateInputFile(numOfSquares, fileIndex):
  sideLength = 5

  unrotatedSquares = generateSquares(numOfSquares, sideLength)
  # print(unrotatedSquares)
  squares = list(map(randomlyRotateSquare, unrotatedSquares[:]))
  # print(squares)
  
  primes = getPrimes(numOfSquares)
  random.shuffle(primes)

  indexOrder = list(range(numOfSquares))
  randomIndexOrder = indexOrder[:]
  random.shuffle(randomIndexOrder)
  # print(indexOrder, randomIndexOrder)

  lines = drawSqauresAndPrimes(squares, primes, sideLength, randomIndexOrder)
  debugLines = drawSqauresAndPrimes(unrotatedSquares, primes, sideLength, indexOrder)
  
  fileIndex = str(fileIndex)

  f = open('inputs/' + fileIndex + '.txt', 'w')
  f.write(lines)
  f.close()

  f = open('debug/' + fileIndex + '.txt', 'w')
  f.write(debugLines)
  f.close()

  f = open('answers/41/' + fileIndex + '.txt', 'w')
  f.write(str(primes[0] * primes[-1]))
  f.close()
