const syllable = require('syllable')
const punctuationRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g

// extends Math object
Math.copySign = (x, y) => {
  return x * (y / Math.abs(y))
}
Math.legacyRound = (number, points = 0) => {
  const p = 10 ** points
  // return float(math.floor((number * p) + math.copysign(0.5, number))) / p
  return Math.floor((number * p) + Math.copySign(0.5, number)) / p
}

class Readability {
  static getGradeSuffix (grade) {
    grade = Math.floor(grade)
    // poor function fix this, gives { 22th and 23th grade }
    const gradeMap = {
      1: 'st',
      2: 'nd',
      3: 'rd'
    }
    return gradeMap[grade] ? gradeMap[grade] : 'th'
  }
  charCount (text, ignoreSpaces = true) {
    if (ignoreSpaces) text = text.replace(/ /g, '')
    return text.length
  }
  letterCount (text, ignoreSpaces = true) {
    if (ignoreSpaces) text = text.replace(/ /g, '')
    return this.removePunctuation(text).length
  }
  removePunctuation (text) {
    text = text.replace(punctuationRE, '')
    return text
  }
  lexiconCount (text, removePunctuation = true) {
    if (removePunctuation) text = this.removePunctuation(text)
    text = text.split(/,| |\n|\r/)
    text = text.filter(n => n)
    return text.length
  }
  syllableCount (text, lang = 'en-US') {
    text = text.toLocaleLowerCase(lang)
    text = this.removePunctuation(text)
    if (!text) return 0
    // eventually replace syllable
    const count = syllable(text)
    return count - 2 // done because js lib overs compared to python // should be probably removed
  }
  sentenceCount (text) {
    let ignoreCount = 0
    let sentences = text.split(/ *[.?!]['")\]]*[ |\n](?=[A-Z])/g)
    for (let sentence of sentences) {
      if (this.lexiconCount(sentence) <= 2) ignoreCount += 1
    }
    const validSentences = sentences.length - ignoreCount
    return validSentences > 1 ? validSentences : 1
  }
  averageSentenceLength (text) {
    const asl = this.lexiconCount(text) / this.sentenceCount(text)
    const returnVal = Math.legacyRound(asl, 1)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  averageSyllablePerWord (text) {
    const syllables = this.syllableCount(text)
    const words = this.lexiconCount(text)
    const syllablePerWord = syllables / words
    const returnVal = Math.legacyRound(syllablePerWord, 1)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  averageCharacterPerWord (text) {
    const charactersPerWord = this.charCount(text) / this.lexiconCount(text)
    const returnVal = Math.legacyRound(charactersPerWord, 2)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  averageLetterPerWord (text) {
    const lettersPerWord = this.letterCount(text) / this.lexiconCount(text)
    const returnVal = Math.legacyRound(lettersPerWord, 2)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  averageSentencePerWord (text) {
    const sentencesPerWord = this.sentenceCount(text) / this.lexiconCount(text)
    const returnVal = Math.legacyRound(sentencesPerWord, 2)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  fleschReadingEase (text) {
    const sentenceLength = this.averageSentenceLength(text)
    const syllablesPerWord = this.averageSyllablePerWord(text)
    const flesch = 206.835 - (1.015 * sentenceLength) - (84.6 * syllablesPerWord)
    const returnVal = Math.legacyRound(flesch, 2)
    return returnVal
  }
  fleschKincaidGrade (text) {
    const sentenceLength = this.averageSentenceLength(text)
    const syllablePerWord = this.averageSyllablePerWord(text)
    const flesch = 0.39 * sentenceLength + 11.8 * syllablePerWord - 15.59
    const returnVal = Math.legacyRound(flesch, 1)
    return returnVal
  }
  polySyllableCount (text) {
    let count = 0
    let wrds
    for (let word of text.split(' ')) {
      wrds = this.syllableCount(word)
      if (wrds >= 3) count += 1
    }
    return count
  }
  smogIndex (text) {
    const sentences = this.sentenceCount(text)
    if (sentences >= 3) {
      const polySyllab = this.polySyllableCount(text)
      const smog = 1.043 * (30 * (polySyllab / sentences)) ** 0.5 + 3.1291
      const returnVal = Math.legacyRound(smog, 1)
      return !isNaN(returnVal) ? returnVal : 0.0
    }
    return 0.0
  }
  colemanLiauIndex (text) {
    const letters = Math.legacyRound(this.averageLetterPerWord(text) * 100, 2)
    const sentences = Math.legacyRound(this.averageSentencePerWord(text) * 100, 2)
    const coleman = 0.058 * letters - 0.296 * sentences - 15.8
    return Math.legacyRound(coleman, 2)
  }
  automatedReadabilityIndex (text) {
    const characters = this.charCount(text)
    const words = this.lexiconCount(text)
    const sentences = this.sentenceCount(text)

    const averageCharacterPerWord = characters / words
    const averageWordPerSentence = words / sentences
    const readability = (
      (4.71 * Math.legacyRound(averageCharacterPerWord, 2)) +
      (0.5 * Math.legacyRound(averageWordPerSentence, 2)) -
      21.43
    )
    const returnVal = Math.legacyRound(readability, 1)
    return !isNaN(returnVal) ? returnVal : 0.0
  }
  linsearWriteFormula (text) {
    // to be implemented
  }
  difficultWords (text, syllable_threshold = 2) {
    // to be implemented
  }
  daleChallReadabilityScore (text) {
    // to be implmented
  }
  gunningFog (text) {
    // to be implemented
  }
  lix (text) {
    // to be implemented
  }
  rix (text) {
    // to be implemented
  }
  textStandard (text, floatOutput = null) {
    const grade = []
    // Appending Flesch Kincaid Grade
    let lower = Math.legacyRound(this.fleschKincaidGrade(text))
    let upper = Math.ceil(this.fleschKincaidGrade(text))
    grade.push(Math.floor(lower))
    grade.push(Math.floor(upper))

    let score = this.fleschReadingEase(text)
    if (score < 100 && score >= 90) grade.push(5)
    else if (score < 90 && score >= 80) grade.push(6)
    else if (score < 80 && score >= 70) grade.push(7)
    else if (score < 70 && score >= 60) { grade.push(8); grade.push(9); }
    else if (score < 60 && score >= 50) grade.push(10)
    else if (score < 50 && score >= 40) grade.push(11)
    else if (score < 40 && score >= 30) grade.push(12)
    else grade.push(13)

    // console.log('grade till now: \n', grade)

    lower = Math.legacyRound(this.smogIndex(text))
    upper = Math.ceil(this.smogIndex(text))
    grade.push(Math.floor(lower))
    grade.push(Math.floor(upper))

    // Appending Coleman_Liau_Index
    lower = Math.legacyRound(this.colemanLiauIndex(text))
    upper = Math.ceil(this.colemanLiauIndex(text))
    grade.push(Math.floor(lower))
    grade.push(Math.floor(upper))

    // Appending Automated_Readability_Index
    lower = Math.legacyRound(this.automatedReadabilityIndex(text))
    upper = Math.ceil(this.automatedReadabilityIndex(text))
    grade.push(Math.floor(lower))
    grade.push(Math.floor(upper))

    // console.log('grade till now : 2 : \n', grade)

    // // Appending  Dale_Chall_Readability_Score
    // lower = Math.legacyRound(this.daleChallReadabilityScore(text))
    // console.log('daleChall: ', lower)
    // upper = Math.ceil(this.daleChallReadabilityScore(text))
    // grade.push(Math.floor(lower))
    // grade.push(Math.floor(upper))
    // // Appending  Linsear_Write_Formula
    // lower = Math.legacyRound(this.linsearWriteFormula(text))
    // upper = Math.ceil(this.linsearWriteFormula(text))
    // grade.push(Math.floor(lower))
    // grade.push(Math.floor(upper))
    // // Appending Gunning Fog Index
    // lower = Math.legacyRound(this.gunningFog(text))
    // upper = Math.ceil(this.gunningFog(text))
    // grade.push(Math.floor(lower))
    // grade.push(Math.floor(upper))
    // d = Counter(grade)
    // final_grade = d.most_common(1)
    // score = final_grade[0][0]

    // if float_output:
    //     return float(score)
    // else:
    //     lower_score = int(score) - 1
    //     upper_score = lower_score + 1
    //     return "{}{} and {}{} grade".format(
    //         lower_score, get_grade_suffix(lower_score),
    //         upper_score, get_grade_suffix(upper_score)
    //     )
    // Finding the Readability Consensus based upon all the above tests
    const counterMap = [...new Set(grade)].map(x => [x, grade.filter(y => y === x).length])
    const finalGrade = counterMap.reduce((x, y) => y[1] >= x[1] ? y : x)
    score = finalGrade[0]
    if (floatOutput) return score
    const lowerScore = Math.floor(score) - 1
    const upperScore = lowerScore + 1
    return `${lowerScore}${Readability.getGradeSuffix(lowerScore)} and ${upperScore}${Readability.getGradeSuffix(upperScore)} grade`
  }
}
const readability = new Readability()
module.exports = readability
