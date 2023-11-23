// import React, { useEffect } from 'react';
// import { Chart, registerables } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// const ProfitDiagram = () => {
//   useEffect(() => {
//     Chart.register(...registerables);

//     Chart.pluginService.register({
//       beforeInit: function (chart) {
//         var data = chart.config.data;
//         for (var i = 0; i < data.datasets.length; i++) {
//           for (var j = 0; j < data.labels.length; j++) {
//             var fct = data.datasets[i].function,
//               x = data.labels[j],
//               y = fct(x);
//             data.datasets[i].data.push(y);
//           }
//         }
//       },
//     });

//     return () => {
//       Chart.unregister(...registerables);
//       Chart.pluginService.unregister();
//     };
//   }, []);

//   const chartData = {
//     labels: [1, 2, 3, 4, 5],
//     datasets: [
//       {
//         label: "f(x) = x",
//         function: function (x) {
//           return x;
//         },
//         data: [],
//         borderColor: "rgba(75, 192, 192, 1)",
//         fill: false,
//       },
//       {
//         label: "f(x) = x²",
//         function: function (x) {
//           return x * x;
//         },
//         data: [],
//         borderColor: "rgba(153, 102, 255, 1)",
//         fill: false,
//       },
//     ],
//   };

//   return <Bar data={chartData} />;
// };

// export default ProfitDiagram;
