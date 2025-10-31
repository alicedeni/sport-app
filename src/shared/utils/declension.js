/**
 * Функция для склонения слов в зависимости от числа
 * @param {number} count - количество
 * @param {string} wordType - тип слова ('participant' или 'team')
 * @returns {string} - склоненное слово
 */
export const getDeclension = (count, wordType) => {
  const words = {
    participant: ['участник', 'участника', 'участников'],
    team: ['команда', 'команды', 'команд'],
    comment: ['комментарий', 'комментария', 'комментариев'],
  }

  if (!words[wordType]) {
    return ''
  }

  const cases = [2, 0, 1, 1, 1, 2]
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 14) {
    return words[wordType][2]
  }

  const mod10 = count % 10
  return words[wordType][cases[mod10 < 5 ? mod10 : 5]]
}
