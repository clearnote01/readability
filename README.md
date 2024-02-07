# text-readability 
npm package to calculate statistics from text to determine readability, complexity and grade level of a particular corpus.

A rewrite of [textstat](https://github.com/shivam5992/textstat) library in JS

## Usage

install required packages with `npm install text-readability`

```javascript
>>> import rs from 'text-readability';

>>> const testData = `
      Playing games has always been thought to be important to 
      the development of well-balanced and creative children; 
      however, what part, if any, they should play in the lives 
      of adults has never been researched that deeply. I believe 
      that playing games is every bit as important for adults 
      as for children. Not only is taking time out to play games 
      with our children and other adults valuable to building 
      interpersonal relationships but is also a wonderful way 
      to release built up tension. `

>>> rs.fleschReadingEase(testData)
>>> rs.fleschKincaidGrade(testData)
>>> rs.colemanLiauIndex(testData)
>>> rs.automatedReadabilityIndex(testData)
>>> rs.daleChallReadabilityScore(testData)
>>> rs.difficultWords(testData)
>>> rs.linsearWriteFormula(testData)
>>> rs.gunningFog(testData)
>>> rs.textStandard(testData)
```

The argument (text) for all the defined functions remains the same -
i.e the text for which statistics need to be calculated.

## Install using npm

```shell
npm install text-readability
```

## List of Functions

### Syllable Count

```javascript
rs.syllableCount(text, lang='en-US')
```

Returns the number of syllables present in the given text.

Uses the npm module [syllable](https://github.com/words/syllable)
for syllable calculation. `lang` currently only used for proper lowercasing  
Should be passed to `syllable` or write own library for this

### Lexicon Count

```javascript
rs.lexiconCount(text, removePunctuation=true)
```

Calculates the number of words present in the text.
Optional `removePunctuation` specifies whether we need to take
punctuation symbols into account while counting lexicons.
Default value is `true`, which removes the punctuation
before counting lexicon items.

### Sentence Count

```javascript
rs.sentenceCount(text)
```

Returns the number of sentences present in the given text.


### The Flesch Reading Ease formula

```javascript
rs.fleschReadingEase(text)
```

Returns the Flesch Reading Ease Score.

The following table can be helpful to assess the ease of
readability in a document.

The table is an _example_ of values. While the
maximum score is 121.22, there is no limit on how low
the score can be. A negative score is valid.

| Score |    Difficulty     |
|-------|-------------------|
|90-100 | Very Easy         |
| 80-89 | Easy              |
| 70-79 | Fairly Easy       |
| 60-69 | Standard          |
| 50-59 | Fairly Difficult  |
| 30-49 | Difficult         |
| 0-29  | Very Confusing    |

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch_reading_ease)

### The Flesch-Kincaid Grade Level

```javascript
rs.fleschKincaidGrade(text)
```

Returns the Flesch-Kincaid Grade of the given text. This is a grade
formula in that a score of 9.3 means that a ninth grader would be able to
read the document.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests#Flesch%E2%80%93Kincaid_grade_level)

### The Fog Scale (Gunning FOG Formula)

```javascript
rs.gunningFog(text)
```

Returns the FOG index of the given text. This is a grade formula in that
a score of 9.3 means that a ninth grader would be able to read the document.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Gunning_fog_index)

### The SMOG Index

```javascript
rs.smogIndex(text)
```

Returns the SMOG index of the given text. This is a grade formula in that
a score of 9.3 means that a ninth grader would be able to read the document.

Texts of fewer than 30 sentences are statistically invalid, because
the SMOG formula was normed on 30-sentence samples. textstat requires atleast
3 sentences for a result.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/SMOG)

### Automated Readability Index

```javascript
rs.automatedReadabilityIndex(text)
```

Returns the ARI (Automated Readability Index) which outputs
a number that approximates the grade level needed to
comprehend the text.

For example if the ARI is 6.5, then the grade level to comprehend
the text is 6th to 7th grade.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Automated_readability_index)

### The Coleman-Liau Index

```javascript
rs.colemanLiauIndex(text)
```

Returns the grade level of the text using the Coleman-Liau Formula. This is
a grade formula in that a score of 9.3 means that a ninth grader would be
able to read the document.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Coleman%E2%80%93Liau_index)

### Linsear Write Formula

```javascript
rs.linsearWriteFormula(text)
```

Returns the grade level using the Linsear Write Formula. This is
a grade formula in that a score of 9.3 means that a ninth grader would be
able to read the document.

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Linsear_Write)

### Dale-Chall Readability Score

```javascript
rs.daleChallReadabilityScore(text)
```

Different from other tests, since it uses a lookup table
of the most commonly used 3000 English words. Thus it returns
the grade level using the New Dale-Chall Formula.

| Score       |  Understood by                                |
|-------------|-----------------------------------------------|
|4.9 or lower | average 4th-grade student or lower            |
|  5.0–5.9    | average 5th or 6th-grade student              |
|  6.0–6.9    | average 7th or 8th-grade student              |
|  7.0–7.9    | average 9th or 10th-grade student             |
|  8.0–8.9    | average 11th or 12th-grade student            |
|  9.0–9.9    | average 13th to 15th-grade (college) student  |

> Further reading on
[Wikipedia](https://en.wikipedia.org/wiki/Dale%E2%80%93Chall_readability_formula)

### Readability Consensus based upon all the above tests

```javascript
rs.textStandard(text, float_output=False)
```

Based upon all the above tests, returns the estimated school
grade level required to understand the text.

Optional `float_output` allows the score to be returned as a
`float`. Defaults to `false`.

