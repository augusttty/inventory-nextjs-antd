import { connectDB } from "@/config/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Recording from "@/models/recordingModel";
import { validateJWT } from "@/helpers/validateJWT";

connectDB();

export async function GET(request: NextRequest) {
  try {
    validateJWT(request);

    const filtersObject: any = {};

    const graphData = await Recording.find(filtersObject)
      .populate("productCode")
      .populate("market");

    // console.log('queryAll/route.ts  ',graphData)

    const totBuyUnits: any = {};
    const totBuyPrice: any = {};
    const totSellUnits: any = {};
    const totSellPrice: any = {};
    const totTaxes: any = {};
    graphData.forEach((item) => {
      const { productCode, mode, pricePerUnit, units, market, taxes } = item;
      console.log(market)
      if (mode === "buying") {
        if (!totBuyPrice[productCode])
          totBuyPrice[productCode] = pricePerUnit * units;
        else totBuyPrice[productCode] += pricePerUnit * units;

        if (!totBuyUnits[productCode]) totBuyUnits[productCode] = units;
        else totBuyUnits[productCode] += units;
      } else if (mode === "selling") {
        if (!totSellPrice[productCode])
          totSellPrice[productCode] = pricePerUnit * units;
        else totSellPrice[productCode] += pricePerUnit * units;

        if (!totSellUnits[productCode]) totSellUnits[productCode] = units;
        else totSellUnits[productCode] += units;

        if (!totTaxes[productCode])
          if (taxes !== undefined)
            totTaxes[productCode] = (taxes * pricePerUnit * units) / 100;
          else {
            if (taxes !== undefined)
              totTaxes[productCode] += (taxes * pricePerUnit * units) / 100;
          }
      }
    });
    const avgBuyPrice: any = {};
    let allBuyPrice: any = 0;
    let allBuyUnits: any = 0;
    for (const productCode in totBuyPrice) {
      avgBuyPrice[productCode] =
        totBuyPrice[productCode] / totBuyUnits[productCode];
      allBuyPrice += totBuyPrice[productCode];
      allBuyUnits += totBuyUnits[productCode];
    }
    // console.log(avgBuyPrice)
    const avgSellPrice: any = {};
    let allSellPrice: any = 0;
    let allSellUnits: any = 0;
    let allTaxes: any = 0;
    for (const productCode in totSellPrice) {
      avgSellPrice[productCode] =
        totSellPrice[productCode] / totSellUnits[productCode];
      allSellPrice += totSellPrice[productCode];
      allSellUnits += totSellUnits[productCode];
      allTaxes += totTaxes[productCode];
    }

    const profitCode: any = {};
    const profitMarket: any = {};
    let allProfit: any = 0;
    graphData.forEach((item) => {
      const { productCode, mode, pricePerUnit, units, market, taxes } = item;
      if (mode === "selling") {
        if (taxes !== undefined) {
          const profit =
            ((1 - taxes / 100) * pricePerUnit - avgBuyPrice[productCode]) *
            units;
          if (!profitCode[productCode]) profitCode[productCode] = profit;
          else profitCode[productCode] += profit;
          allProfit += profit;

          if (market !== undefined) {
            if (!profitMarket[market]) profitMarket[market] = profit;
            else profitMarket[market] += profit;
          }
        }
      }
    });

    return NextResponse.json(
      {
        TotalUnitsSold: allSellUnits,
        TotalAverageBuyPrice: allBuyPrice / allBuyUnits,
        TotalAverageSellPrice: allSellPrice / allSellUnits,
        TotalProfit: allProfit,
        AverageMoneyInTaxes: allTaxes / allSellUnits,
        profitCode,
        profitMarket,
      },
      {
        status: 201,
      }
    );

    // console.log('queryAll/route.ts  ',products)

    // return NextResponse.json(graphData)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
}
