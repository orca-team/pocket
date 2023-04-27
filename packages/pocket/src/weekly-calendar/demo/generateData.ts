import moment from 'moment';

type GenerateDataOptions = {
  length?: number;
  randomColor?: boolean;
};

export default function generateData(options: GenerateDataOptions = {}) {
  const { length = 10, randomColor = true } = options;
  const data = new Array(length).fill(0)
    .map((_, index) => {
      const start = moment()
        .weekday(-1)
        .hour(Math.random() * 23)
        .minute(Math.random() * 60)
        .add(Math.round(Math.random() * 10), 'day');
      const end = start.clone().add(Math.random() * (6 + (Math.random() < 0.1 ? Math.random() * 40 : 0)), 'hour');
      return {
        title: `_${index}`,
        start,
        end,
        color: randomColor
          ? `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, 0.3)`
          : undefined,
      };
    });
  return data;
}
