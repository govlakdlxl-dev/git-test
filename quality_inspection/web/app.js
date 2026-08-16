const dashboardData = {
  totalInspections: 1941,
  largeFaultRate: 0.184,
  warningFault: "K_Scatch",
  macroF1: 0.834,
  faultDistribution: [
    { label: "Other_Faults", value: 673 },
    { label: "Bumps", value: 402 },
    { label: "K_Scatch", value: 391 },
    { label: "Z_Scratch", value: 190 },
    { label: "Pastry", value: 158 },
    { label: "Stains", value: 72 },
    { label: "Dirtiness", value: 55 }
  ],
  largeFaultDistribution: [
    { label: "K_Scatch", value: 0.52 },
    { label: "Bumps", value: 0.21 },
    { label: "Other_Faults", value: 0.17 },
    { label: "Z_Scratch", value: 0.1 }
  ],
  models: [
    {
      name: "RandomForest_50",
      accuracy: 0.81,
      macroF1: 0.831,
      fitSeconds: 0.16
    },
    {
      name: "HGB_lr0.03_iter200_leaf15",
      accuracy: 0.812,
      macroF1: 0.834,
      fitSeconds: 3.9
    },
    {
      name: "LogisticRegression_scaled",
      accuracy: 0.645,
      macroF1: 0.637,
      fitSeconds: 0.03
    }
  ],
  otherWarning:
    "Other_Faults는 여러 결함이 섞인 라벨이므로 일반 결함 유형처럼 단정해서 해석하기 어렵습니다.",
  dailyInsight:
    "큰 결함만 보면 K_Scatch가 가장 두드러지므로 스크래치 관련 공정 조건을 우선 점검할 필요가 있습니다.",
  actions: [
    "K_Scatch 발생 구간의 설비 조건과 작업 이력을 먼저 확인합니다.",
    "Other_Faults 샘플을 별도 검토해 세부 결함으로 재분류할 수 있는지 확인합니다.",
    "모델 운영 시 accuracy만 보지 않고 macro_f1과 클래스별 recall을 함께 확인합니다."
  ]
};

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function renderKpis(data) {
  document.querySelector("#total-inspections").textContent =
    data.totalInspections.toLocaleString("ko-KR");
  document.querySelector("#large-fault-rate").textContent = formatPercent(
    data.largeFaultRate
  );
  document.querySelector("#warning-fault").textContent = data.warningFault;
  document.querySelector("#macro-f1").textContent = data.macroF1.toFixed(3);
}

function renderBars(containerId, rows, options = {}) {
  const container = document.querySelector(containerId);
  const maxValue = Math.max(...rows.map((row) => row.value));

  container.innerHTML = rows
    .map((row) => {
      const width = maxValue === 0 ? 0 : (row.value / maxValue) * 100;
      const valueText = options.percent
        ? formatPercent(row.value)
        : row.value.toLocaleString("ko-KR");
      const attentionClass =
        row.label === dashboardData.warningFault ? " attention" : "";

      return `
        <div class="bar-row">
          <span class="bar-label">${row.label}</span>
          <span class="bar-track">
            <span class="bar-fill${attentionClass}" style="width: ${width}%"></span>
          </span>
          <span class="bar-value">${valueText}</span>
        </div>
      `;
    })
    .join("");
}

function renderModelTable(models) {
  const tableBody = document.querySelector("#model-table");

  tableBody.innerHTML = models
    .map(
      (model) => `
        <tr>
          <td>${model.name}</td>
          <td>${model.accuracy.toFixed(3)}</td>
          <td>${model.macroF1.toFixed(3)}</td>
          <td>${model.fitSeconds.toFixed(2)}s</td>
        </tr>
      `
    )
    .join("");
}

function renderDecisionText(data) {
  document.querySelector("#other-warning").textContent = data.otherWarning;
  document.querySelector("#daily-insight").textContent = data.dailyInsight;
  document.querySelector("#actions").innerHTML = data.actions
    .map((action) => `<li>${action}</li>`)
    .join("");
}

renderKpis(dashboardData);
renderBars("#fault-bars", dashboardData.faultDistribution);
renderBars("#large-fault-bars", dashboardData.largeFaultDistribution, {
  percent: true
});
renderModelTable(dashboardData.models);
renderDecisionText(dashboardData);
