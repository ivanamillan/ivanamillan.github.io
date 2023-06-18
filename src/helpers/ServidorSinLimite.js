// c = Number of servers
// N = Limit of people in the queue
// Lambda => λ = Arrival time of the people to be served
// Mu => μ = Response time of the servers to the people in queue
// Ro = Average usage of the system
// Lq = Average number of clients on the queue
// Wq = Average time on the queue
// Ws = Average time on the system
// Ls = Average amoun of clients on the system
// Po = Probability that system is empty
// Pn = Probability that system has n amount of clients

// Ro
const averageUsageOfTheSystem = ({ arrivalTime, responseTime }) => {
  return arrivalTime / responseTime
}

// Wq
const averageTimeOnQueue = ({ arrivalTime, responseTime }) => {
  return averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime }) / arrivalTime
}

// Ws
const averageTimeOnSystem = ({ arrivalTime, responseTime }) => {
  return (1 / (responseTime - arrivalTime))
}

// Lq
const averageNumberOfClientsOnTheQueue = ({ arrivalTime, responseTime }) => {
  return ((arrivalTime ** 2) / (responseTime * (responseTime - arrivalTime)));
}

// Ls
const averageNumberOfClientsOnTheSystem = ({ arrivalTime, responseTime }) => {
  return (arrivalTime / (responseTime - arrivalTime));
}

// Po
const chanceTheSystemIsEmpty = ({ usageOfTheSystem }) => {
  return 1 - usageOfTheSystem;
}

// Pn
const chanceTheyAreOnSystem = ({ clientsAmount, usageOfTheSystem }) => {

  return ((1 - usageOfTheSystem) * (usageOfTheSystem ** clientsAmount))
}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ clientsAmount = 100, usageOfTheSystem }) => {
  const result = []
  let counter = 0;
  let accumulated = 0;
  while (counter < clientsAmount) {
    const chance = chanceTheyAreOnSystem({ clientsAmount: counter, usageOfTheSystem })
    accumulated += chance;
    result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
    counter++;

    if (Number(chance.toFixed(4)) === 0) break;
  }

  return result;
}

const oneServerWithNoLimit = ({ arrivalTime, responseTime }) => {
  const usageOfTheSystem = averageUsageOfTheSystem({ arrivalTime, responseTime });
  const timeOnSystem = averageTimeOnSystem({ arrivalTime, responseTime });
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ arrivalTime, responseTime });
  const timeOnQueue = averageTimeOnQueue({ arrivalTime, responseTime });
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ arrivalTime, responseTime });
  const chanceTheyAre = chanceTheyAreOnSystemDetails({ usageOfTheSystem });

  return {
    usageOfTheSystem,
    timeOnSystem,
    numberOfClientsOnTheQueue,
    timeOnQueue,
    numberOfClientsOnTheSystem,
    chanceTheyAre,
  }
}

export default oneServerWithNoLimit;