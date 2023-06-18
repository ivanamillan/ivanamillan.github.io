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
  return (arrivalTime / responseTime)
}

// Wq
const averageTimeOnQueue = ({ usageOfTheSystem, limit, arrivalTime, responseTime }) => {
  return (averageNumberOfClientsOnTheQueue({ usageOfTheSystem, limit, arrivalTime, responseTime }) / chanceToEnterTheSystem({ arrivalTime, usageOfTheSystem, limit }))
}

// Ws
const averageTimeOnSystem = ({ usageOfTheSystem, limit, arrivalTime, responseTime }) => {
  return (averageTimeOnQueue({ usageOfTheSystem, limit, arrivalTime, responseTime }) + (1 / responseTime));
}

// Lq
const averageNumberOfClientsOnTheQueue = ({ usageOfTheSystem, limit, arrivalTime, responseTime }) => {
  return (averageNumberOfClientsOnTheSystem({ usageOfTheSystem, limit }) - (chanceToEnterTheSystem({ arrivalTime, usageOfTheSystem, limit }) / responseTime));
}

// λef
const chanceToEnterTheSystem = ({ arrivalTime, usageOfTheSystem, limit }) => {
  return (arrivalTime * (1 - chanceTheyAreOnSystem({ clientsAmount: limit, usageOfTheSystem, limit })));
}

// Ls
const averageNumberOfClientsOnTheSystem = ({ usageOfTheSystem, limit }) => {

  if (usageOfTheSystem !== 1) {
    return ((usageOfTheSystem * (1 - ((limit + 1) * (usageOfTheSystem ** limit)) + (limit * (usageOfTheSystem ** (limit + 1))))) / ((1 - usageOfTheSystem) * (1 - (usageOfTheSystem ** (limit + 1)))))
  }

  return (limit / 2);
}

// Po
const chanceTheSystemIsEmpty = ({ usageOfTheSystem, limit }) => {
  if (usageOfTheSystem !== 1) {
    return ((1 - usageOfTheSystem) / (1 - (usageOfTheSystem ** (limit + 1))));
  }

  return (1 / (limit + 1));
}

// Pn
const chanceTheyAreOnSystem = ({ clientsAmount, usageOfTheSystem, limit }) => {
  if (clientsAmount <= limit) {
    const chanceIsEmpty = chanceTheSystemIsEmpty({ usageOfTheSystem, limit });

    return ((usageOfTheSystem ** clientsAmount) * chanceIsEmpty);
  }

  return 0;
}

// n + Pn + Pn Accumulated 
const chanceTheyAreOnSystemDetails = ({ usageOfTheSystem, limit }) => {
  const result = []


  if (usageOfTheSystem !== 1) {
    let counter = 0;
    let accumulated = 0;
    while (counter <= limit) {
      const chance = chanceTheyAreOnSystem({ clientsAmount: counter, usageOfTheSystem, limit });
      accumulated += chance;
      result.push({ n: counter, Pn: chance, PnAccumulated: accumulated });
      counter++;
    }
  } else {
    const chance = (1 / (limit + 1));
    result.push({ n: 1, Pn: chance, PnAccumulated: chance });
  }

  return result;
}

const oneServerWithLimit = ({ arrivalTime, responseTime, limit }) => {
  const usageOfTheSystem = averageUsageOfTheSystem({ arrivalTime, responseTime });
  const timeOnSystem = averageTimeOnSystem({ usageOfTheSystem, limit, arrivalTime, responseTime });
  const numberOfClientsOnTheQueue = averageNumberOfClientsOnTheQueue({ usageOfTheSystem, limit, arrivalTime, responseTime });
  const timeOnQueue = averageTimeOnQueue({ usageOfTheSystem, limit, arrivalTime, responseTime });
  const numberOfClientsOnTheSystem = averageNumberOfClientsOnTheSystem({ usageOfTheSystem, limit });
  const chanceTheyAre = chanceTheyAreOnSystemDetails({ usageOfTheSystem, limit });

  return {
    usageOfTheSystem,
    timeOnSystem,
    numberOfClientsOnTheQueue,
    timeOnQueue,
    numberOfClientsOnTheSystem,
    chanceTheyAre,
  }
}

export default oneServerWithLimit;