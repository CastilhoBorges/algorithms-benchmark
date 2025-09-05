type AlgoFn<T> = (input: T) => any;
type InputGenerator<T> = (n: number) => T;

function measureTime<T>(fn: () => T): { result: T; timeMs: number } {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const timeMs = Number(end - start) / 1_000_000;
  return { result, timeMs };
}

export function benchmark<T>(
  name: string,
  fn: AlgoFn<T>,
  generator: InputGenerator<T>,
  sizes: number[]
) {
  console.log(`\n⏱️ Benchmark: ${name}`);
  console.log('-----------------------------------');

  const results = sizes.map((n) => {
    const input = generator(n);
    const { timeMs } = measureTime(() => fn(input));
    return { n, timeMs };
  });

  console.table(results);

  console.log('\n📈 Crescimento entre os tamanhos:');
  for (let i = 1; i < results.length; i++) {
    const prev = results[i - 1];
    const curr = results[i];
    const growthTime = curr.timeMs / prev.timeMs;
    const growthN = curr.n / prev.n;
    console.log(
      `De n=${prev.n} -> n=${curr.n}: tempo x${growthTime.toFixed(
        2
      )}, n x${growthN}`
    );
  }
  
  const ratios = [];
  for (let i = 1; i < results.length; i++) {
    ratios.push(results[i].timeMs / results[i - 1].timeMs);
  }
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

  console.log('\n🔎 Estimativa de complexidade:');
  if (avgRatio < 1.5) {
    console.log('O(1) ~ constante');
  } else if (avgRatio < 3) {
    console.log('O(n) ~ linear');
  } else if (avgRatio < 6) {
    console.log('O(n log n) ~ quase-linear');
  } else {
    console.log('O(n^2) ou pior');
  }
}
