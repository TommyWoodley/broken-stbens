const betaMap: { [feature: string]: string[] } = {
  marks: ['50007.1', '40009', '70055', '70028'],
}

function featureEnabled(feature: string, module: string) {
  return betaMap[feature].includes(module)
}
export default featureEnabled
