const config = require('#config');
const problems = require('#database/problems');

function getFormattedTimeIntervalAsString(timestamp) {
  const seconds = Math.floor((timestamp/1000) % 60).toString().padStart(2, '0');
  const minutes = Math.floor((timestamp/1000/60) % 60).toString().padStart(2, '0');
  const hours = Math.floor((timestamp/1000/60/60) % 24).toString().padStart(2, '0');
  const days = Math.floor((timestamp/1000/60/60/24)).toString();

  let formatted = [hours, minutes, seconds].join(':');
  if (days !== '0') { // prepend if there are days
    formatted = days + ':' + formatted;
  }
  return formatted;
}

// assume day argument is 1-based day counting number
async function getRankingForDay(day, openDayTimestamp) {
  const problemId = day.toString() + '2';
  const numOfRankings = 30;
  const ranking = await problems.getRankingForProblem(problemId, numOfRankings);
  
  const formattedRanking = ranking.map(entry => {
    const { rankerName, solvedTimestamp } = entry;

    const elapsedTimestamp = solvedTimestamp - openDayTimestamp;
    const formattedElapsedTime = getFormattedTimeIntervalAsString(elapsedTimestamp);
    
    return { rankerName, elapsedTime: formattedElapsedTime };
  });

  return formattedRanking;
}

module.exports = async (req, res) => {
  const numOfDays = 4;
  const firstDayOpenTime = new Date(config.site.firstDayOpenTime).getTime();
  const openDayTimestamps = Array(numOfDays).fill(0)
    .map((_, i) => firstDayOpenTime + i*24*60*60*1000);

  const rankings = [];
  for (let i = 0; i < numOfDays; ++i) {
    const day = i+1;
    const openDayTimestamp = openDayTimestamps[i];

    const ranking = await getRankingForDay(day, openDayTimestamp);
    rankings.push(ranking);
  }

  res.locals.rankings = rankings;
  res.render('leaderboard');
}
