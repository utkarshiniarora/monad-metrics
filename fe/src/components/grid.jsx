import TelemetryCard from "./card";

export default function TelemetryGrid({ telemetry }) {
  const data = [
    { label: "Block Height", value: telemetry.blockHeight },
    // { label: "Avg Block Time", value: telemetry.avgBlockTimeSeconds, tag:"s" },
    { label: "TPS", value: telemetry.TPS, tag:"TPS" },
    { label: "Transactions per Block", value: telemetry.transactionsPerBlock, tag:"txs"  },
    { label: "Largest Block TXs", value: telemetry.largestBlockTxs },
    { label: "Avg Gas Used per TX", value: telemetry.avgGasUsedPerTx, tag:"MON"  },
    { label: "Gas Price", value: telemetry.gasPriceGwei.toFixed(2), tag:"Gwei"  },
    { label: "Avg TX Cost", value: telemetry.avgTxCostUSD, tag:"USD"  },
    { label: "Fee Flow", value: telemetry.feeFlowUSDPerSecond, tag:"USD/s"  },
    // { label: "Block Utilization", value: telemetry.blockUtilization  },
    { label: "Chain Token Price", value: telemetry.chainTokenPriceUSD, tag:"MON"  },
  ];

  return (
    <div className="flex justify-content-center align-items-center row row-cols-4">
    
      {data.map((item, idx) => (
        
        <TelemetryCard key={idx} label={item.label} value={item.value} tag={item?.tag} />
      ))}
    </div>
  );
}
