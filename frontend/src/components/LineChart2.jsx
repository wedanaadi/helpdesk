import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import MonthName from "./util/MonthName";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scale: {
    ticks: {
      precision: 0,
    },
  },
  height: {
    type: Number,
    default: 800,
  },
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    // tooltip: {
    //   callbacks: {
    //     title: function () {
    //       return "Jumlah";
    //     }
    //   }
    // },
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: "Grafik Maintenance",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      data: [5, 3, 4, 5, 3],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function lineChartMaintenace({ dataMentah }) {
  const [dataChart, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  useEffect(() => {
    setData({
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    });
    const intv =
      dataMentah.length > 0 &&
      setTimeout(() => {
        let dataSheet = {};
        let Label = [];
        let Data = [];
        dataMentah.length > 0
          ? dataMentah?.map((data) => {
              if(data.id_ticket) {
                Label.push(
                  data.type === "month" ? MonthName(data.label) : `Tgl ${data.label}`
                );
                Data.push(data.jumlah);
              }
            })
          : Label.push([]);
        Data.push([]);
        dataSheet = {
          labels: Label,
          datasets: [
            { label: "Label Test" },
            { data: Data },
            { borderColor: "rgb(255, 99, 132)" },
            { backgroundColor: "rgba(255, 99, 132, 0.5)" },
          ],
        };
        setData(dataSheet);
      }, 1);
    () => clearInterval(intv);
  }, [dataMentah]);
  return dataChart.labels.length > 0 ? (
    <Line options={options} data={dataChart} height={400} />
  ) : (
    <Line options={options} data={dataChart} height={400} />
  );
}
