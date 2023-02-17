import {
  calculateGrade,
  capitaliseFirstLetter,
  encodeURL,
  formatDateRange,
  formatShortYear,
  getFileExtension,
  groupByProperty,
  percentage,
  shortYear,
  validShortYears,
} from '../lib/utilities.service'
import { dateToColumn } from '../pages/Timeline'

describe('dateToColumn', () => {
  it.each`
    date                               | expected
    ${new Date(Date.UTC(2022, 9, 3))}  | ${1}
    ${new Date(Date.UTC(2022, 9, 4))}  | ${2}
    ${new Date(Date.UTC(2022, 9, 8))}  | ${6}
    ${new Date(Date.UTC(2022, 9, 9))}  | ${6}
    ${new Date(Date.UTC(2022, 9, 10))} | ${7}
    ${new Date(Date.UTC(2022, 9, 15))} | ${12}
    ${new Date(Date.UTC(2022, 9, 16))} | ${12}
    ${new Date(Date.UTC(2022, 9, 17))} | ${13}
  `('calculates column index from $date as $expected', ({ date, expected }) => {
    const actual = dateToColumn(date, new Date(Date.UTC(2022, 9, 3)))
    expect(actual).toBe(expected)
  })

  it('throws error if referenceDate is not a Monday', () => {
    expect(() => dateToColumn(new Date(), new Date(2022, 9, 5))).toThrowError(
      'Parameter startDate MUST be a monday.'
    )
  })
})

describe('File utils:', () => {
  test.each`
    path                                                                                                        | expected
    ${''}                                                                                                       | ${''}
    ${'name'}                                                                                                   | ${''}
    ${'name.txt'}                                                                                               | ${'.txt'}
    ${'.htpasswd'}                                                                                              | ${''}
    ${'name.with.many.dots.myext'}                                                                              | ${'.myext'}
    ${'2223/40009/1._Haskell/00fd3bc473af4c6baeb8369dca765d89Lecture05-06.pdf'}                                 | ${'.pdf'}
    ${'2223/40009/1._Haskell/5932ad003bd144b0b3309a51a17c6643Lecture07.hs'}                                     | ${'.hs'}
    ${'2223/40009/1._Haskell/8b09e3c7e50a41c8bc21fdecda3fdb7cLecture06.zip'}                                    | ${'.zip'}
    ${'2223/40009/0._General/0f88da8727a74d6e8379b0ca37d236d6DoC_-_Welcome_to_the_First_Year.pdf'}              | ${'.pdf'}
    ${'2223/40009/1._Haskell/6b0d05e812054bfb9cca8971e1e6840fFP_Lecture_1-4.pdf'}                               | ${'.pdf'}
    ${'2223/40009/0._General/01ff75bf2db84e09bd05955b8c3352c5DoCSoc_-_Basics_of_Git_and_GitLab.pdf'}            | ${'.pdf'}
    ${'2223/40009/0._General/e6de4c92eba7493fbba5a5306c8e8e46DoCSoc_-_Guide_To_Linux_And_The_Command_Line.pdf'} | ${'.pdf'}
    ${'2223/40009/5._C/528b8334e31b4be88fcf6289a15fcee6Placeholder.txt'}                                        | ${'.txt'}
    ${'2223/40009/3._Ethics/05c5fe48eb554e50aa00ac319a4204daPlaceholder.txt'}                                   | ${'.txt'}
    ${'2223/40009/4._Java/35a729a9fea94cfa98810e5dd9d3ddc8Placeholder.txt'}                                     | ${'.txt'}
    ${'2223/40009/0._General/864f9def3d4f4775b7f4c06f490e413cDoCSoc_-_calculator-demo.zip'}                     | ${'.zip'}
    ${'2223/40009/6._Architecture__J_M_C/2793fd1458de4a989f4a6e68748834ecPlaceholder.txt'}                      | ${'.txt'}
    ${'2223/40009/1._Haskell/fa7365918af5479aaa7859a650bfbd77Solutions_to_unassessed_exercises_5.pdf'}          | ${'.pdf'}
    ${'2223/40009/1._Haskell/e665afb7d450423895139dd82914c533Lecture07-09.pdf'}                                 | ${'.pdf'}
    ${'2223/40009/1._Haskell/c85e69d3824241d6bf065794290814e0Solutions_to_unassessed_exercises_6.pdf'}          | ${'.pdf'}
    ${'2223/40009/0._General/c9b5114da60e43cfb325ee6ab1981f1bImperial_Horizons_2022-23.pdf'}                    | ${'.pdf'}
    ${'2223/40009/1._Haskell/5123c4d9dd0445f1a7b36d30fc7d68c2Lectures10-11.pdf'}                                | ${'.pdf'}
    ${'2223/40009/1._Haskell/7cf4bad0b42f4e6894996ff1da714983Practice_test_skeleton.hs'}                        | ${'.hs'}
    ${'2223/40009/0._General/3fccab1bf3e44358b3b1f2bdfeebe8cckgk_-_Intro_to_Year_1__The_Lab.pdf'}               | ${'.pdf'}
    ${'2223/40009/1._Haskell/e0300cb07ca04a1da8d94cd7ce4cf424Practice_test_spec.pdf'}                           | ${'.pdf'}
    ${'2223/40009/1._Haskell/3da646ddc97d479aa9332a05314c9400Practice_test_Test_File_Radix_trees.hs'}           | ${'.hs'}
    ${'2223/40009/1._Haskell/0c95210256684fb2a3ff9ca759801511Lecture12-13.pdf'}                                 | ${'.pdf'}
    ${'2223/40009/1._Haskell/e975562386464bdb904c7df9c0981e23Solutions_to_unassessed_exercises_3.pdf'}          | ${'.pdf'}
    ${'2223/40009/1._Haskell/11e723b19fcc495c8f3355f699a316e9Solutions_to_unassessed_exercises_2.pdf'}          | ${'.pdf'}
    ${'2223/40009/1._Haskell/7ee1342a13bb44c6876887aabe4fdb6eSolutions_to_unassessed_exercises_1.pdf'}          | ${'.pdf'}
    ${'2223/40009/0._General/7070de27fb6d48caad9dd755430ac5d1DoCSoc_-_Text_Editors_and_Compilers.pdf'}          | ${'.pdf'}
    ${'2223/40009/0._General/7df72ffb50054b1cad1d54d9bb7ac539DoCSoc_-_Linux_and_The_Command_Line.pdf'}          | ${'.pdf'}
    ${'2223/40009/1._Haskell/15eadbda547342a58674895a3464567fUnassessed_Exercises.pdf'}                         | ${'.pdf'}
    ${'2223/40009/1._Haskell/6873726ebddd417eb7142614ec662b37Solutions_to_unassessed_exercises_4.pdf'}          | ${'.pdf'}
    ${'2223/40009/0._General/231d10676e78460d9ae5f67be64182d3Careers_-_Teamwork__MBTI.pdf'}                     | ${'.pdf'}
    ${'2223/40009/0._General/8f07ae1d91884928a07694493b4eaba0Careers_-_Personality_Pairings.pdf'}               | ${'.pdf'}
  `("getFileExtension() extracts '$expected' file extension from '$path'", ({ path, expected }) => {
    const actual = getFileExtension(path)
    expect(actual).toBe(expected)
  })
})

describe('Date-time utils:', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test.each`
    month | year    | expected
    ${8}  | ${2020} | ${'1920'}
    ${9}  | ${2020} | ${'2021'}
    ${0}  | ${2100} | ${'9900'}
    ${11} | ${2100} | ${'0001'}
  `(
    "shortYear() calculates short year for 1-$month-$year as '$expected'",
    ({ year, month, expected }) => {
      expect(shortYear(new Date(year, month, 1))).toBe(expected)
    }
  )

  test('shortYear() defaults to current date if no arg is given', () => {
    jest.setSystemTime(new Date(2022, 8, 27))
    expect(shortYear()).toBe('2122')
  })

  test('formatShortYear() formats an academic year into a range', () => {
    expect(formatShortYear('2930')).toBe('2029-30')
  })

  test.each`
    day   | month | year    | expected
    ${1}  | ${2}  | ${2025} | ${['2122', '2223', '2324', '2425']}
    ${26} | ${8}  | ${2022} | ${['2122', '2223']}
    ${26} | ${7}  | ${2022} | ${['2122']}
  `(
    'validShortYears() calculates valid short years available on $day-$month-$year',
    ({ day, month, year, expected }) => {
      jest.setSystemTime(new Date(year, month, day))
      expect(validShortYears()).toEqual(expected)
    }
  )

  test.each`
    start                     | end                     | expected
    ${new Date(2022, 9, 4)}   | ${new Date(2022, 9, 8)} | ${'4-8 Oct'}
    ${new Date(2022, 11, 25)} | ${new Date(2023, 0, 1)} | ${'25 Dec-1 Jan'}
  `('formatDateRange() formats date range into $expected', ({ start, end, expected }) => {
    expect(formatDateRange(start, end)).toBe(expected)
  })
})

describe('Formatting utils:', () => {
  test.each([
    [undefined, ''],
    ['', ''],
    ['l', 'L'],
    ['lorem', 'Lorem'],
  ])("capitaliseFirstLetter() capitalises first letter of '%s'", (str, expected) => {
    expect(capitaliseFirstLetter(str)).toBe(expected)
  })

  test.each([
    [10, 0, ''],
    [-301, 1000, '-31%'],
    [799, 1000, '79%'],
  ])("percentage() calculates floored percentage of %s/%s as '%s'", (mark, maxMark, expected) => {
    expect(percentage(mark, maxMark)).toBe(expected)
  })

  test.each([
    [10, 0, ''],
    [1, 2, 'C'],
    [799, 1000, 'A'],
  ])("calculateGrade() calculates grade of %s/%s as '%s'", (mark, maxMark, expected) => {
    expect(calculateGrade(mark, maxMark)).toBe(expected)
  })
})

describe('groupByProperty function', () => {
  const dataToGroup = [
    { category: 'category1', index: 34 },
    { category: 'category1', index: 14 },
    { category: 'category1', index: 22 },
    { category: 'category1', index: 1 },
    { category: 'category2', index: 17 },
    { category: 'category2', index: 21 },
    { category: 'category2', index: 0 },
  ]

  it('groups by category and sorts by index', () => {
    const expected = {
      category1: [
        { category: 'category1', index: 1 },
        { category: 'category1', index: 14 },
        { category: 'category1', index: 22 },
        { category: 'category1', index: 34 },
      ],
      category2: [
        { category: 'category2', index: 0 },
        { category: 'category2', index: 17 },
        { category: 'category2', index: 21 },
      ],
    }
    expect(groupByProperty(dataToGroup, 'category', 'index')).toEqual(expected)
  })

  it('can sort object keys alphabetically', () => {
    const values = [
      { category: 'week 4', index: 21 },
      { category: 'Cat 10', index: 14 },
      { category: 'misc stuff', index: 22 },
      { category: 'Lecture Notes', index: 1 },
      { category: '1st week', index: 17 },
    ]
    expect(groupByProperty(values, 'category', 'index', true)).toEqual({
      '1st week': [{ category: '1st week', index: 17 }],
      'Cat 10': [{ category: 'Cat 10', index: 14 }],
      'Lecture Notes': [{ category: 'Lecture Notes', index: 1 }],
      'misc stuff': [{ category: 'misc stuff', index: 22 }],
      'week 4': [{ category: 'week 4', index: 21 }],
    })
  })

  it.each([
    ['title', 'index'],
    ['category', 'id'],
  ])("throws error if provided data does not have '%s' or '%s' property", (groupBy, orderBy) => {
    expect(() => groupByProperty(dataToGroup, groupBy, orderBy)).toThrow(
      `'${groupBy}' and '${orderBy}' need be properties of provided objects`
    )
  })
})

test.each`
  URL                                         | encodedURL
  ${'http://example.com'}                     | ${'http://example.com'}
  ${'https://www.doc.ic.ac.uk/~wjk/C++Intro'} | ${'https://www.doc.ic.ac.uk/~wjk/C%2B%2BIntro'}
`('encodeURL replaces $URL with $encodedURL', ({ URL, encodedURL }) => {
  expect(encodeURL(URL)).toEqual(encodedURL)
})
