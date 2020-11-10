import { Matrix4, SystemPerformancePolynom } from './matrix4.js';

// Math calculations

const x = new Matrix4([42875,1225,35,1,64000,1600,40,1,91125,2025,45,1,125000,2500,50,1,216000,3600,60,1,512000,6400,80,1,1000000,10000,100,1,1728000,14400,120,1],8,4);
const xT = x.transpose;

const t = new Matrix4([217.375,286.000,366.625,460.000,688.000,1330.000,2260.000,3526.000],8,1);

const xTMultPorxI = xT.mult(x).inverse;
const xPseudoI = xTMultPorxI.mult(xT);
const a = xPseudoI.mult(t);

let polynom = new SystemPerformancePolynom(a.matrix);
let start = 35;
const end = 300, step = 5;

let range = [];

while (start <= end) {
  range.push(start);
  start += step;
}

// End Math calculations


const $selectElemSolutionDecimalsNr = window["solution-fixed-decimals-nr"];


if ($selectElemSolutionDecimalsNr.value == 0) {
  window["solution-polynom"].textContent = "-";

  document.querySelectorAll('.solution-matrix-term')
    .forEach((el) => el.textContent = "-");

  document.querySelectorAll('.solution-target-value')
    .forEach((el) => el.textContent = "-");
}

$selectElemSolutionDecimalsNr.addEventListener('change', (e) => {
  if (e.target.value != 0) {
    const decimals = Number(e.target.value);

    window["solution-polynom"].innerHTML = "<i class='fas fa-spinner fa-spin'></i>";

    document.querySelectorAll('.solution-matrix-term')
      .forEach((el) => el.innerHTML = "<i class='fas fa-spinner fa-spin'></i>")

    document.querySelectorAll('.solution-target-value')
      .forEach((el) => el.innerHTML = "<i class='fas fa-spinner fa-spin'></i>")

    const solutionFixedNDecimals = polynom.getPolynomFixedToNDecimals(decimals);
    const solutionFixed9Decimals = polynom.getPolynomFixedToNDecimals(9);
    const solutionFixedNDecimalsPolynomStr = solutionFixedNDecimals.polynomVectorStr;

    const targetValues = Array.from(document.querySelectorAll('.target-value')).map((el) => Number(el.textContent));
    const solutionFixedNDecimalsPolynomToString = solutionFixedNDecimals.getPolynomStrToStringFixedToNDecimals(decimals);

    
    setTimeout(() => {
      window["solution-polynom"].textContent = `${solutionFixedNDecimalsPolynomToString}`;

      document.querySelectorAll('.solution-matrix-term')
        .forEach((el, idx) => el.textContent = solutionFixedNDecimalsPolynomStr[idx])

      document.querySelectorAll('.solution-target-value')  
        .forEach((el, idx) => {
          const valuesDif =
            solutionFixed9Decimals.getPolynomSolutionFixedToNDecimalsForTargetValue(targetValues[idx], 9) - solutionFixedNDecimals.getPolynomSolutionFixedToNDecimalsForTargetValue(targetValues[idx], decimals);
          el.innerHTML = `
            <span>${solutionFixedNDecimals.getPolynomSolutionFixedToNDecimalsForTargetValue(targetValues[idx], decimals)}</span> <br>
            <span style="margin-top: .3rem; font-size: .8rem"><strong>Dif.*:</strong> ${valuesDif.toFixed(decimals)}</span>
          `;
        });
    }, 1000);
  } else {
    window["solution-polynom"].textContent = "-";

    document.querySelectorAll('.solution-matrix-term')
      .forEach((el) => el.textContent = "-");

    document.querySelectorAll('.solution-target-value')
      .forEach((el) => el.textContent = "-");
  }
});


const config = {
  type: 'line',
  data: {
    labels: range,
    datasets: [{
      label: 'Tiempo de respuesta T(n)',
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgb(54, 162, 235)',
      data: [],
      fill: false,
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: ''
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'n (Kregs)'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'T (mSeg)'
        }
      }]
    }
  }
};

window.onload = function() {
  const solutionFixed9Decimals = polynom.getPolynomFixedToNDecimals(9);
  const solutionsInRange = solutionFixed9Decimals.getPolynomSolutionsFixedToNDecimalsForTargetRange(range, 9);

  document.querySelector(".main-container__solution-trend-curve").innerHTML = "<i class='fas fa-spinner fa-spin'></i>";

  setTimeout(() => {
    document.querySelector(".main-container__solution-trend-curve").innerHTML = "<canvas id='canvas'></canvas>";

    const ctx = window.canvas.getContext('2d');
    window.lineChart = new Chart(ctx, config);

    config.data.datasets[0].data = solutionsInRange;
    window.lineChart.update();
  }, 1500);
};