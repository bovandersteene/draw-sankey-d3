export const energyData = {
  nodes: [
    {
      type: "IMP",
      label: "Gas",
      name: "IMP_Gas",
      energyCarrier: "Gas",
      value: 10000.0,
    },
    {
      type: "ONSITE",
      label: "Solar Roof",
      name: "ONSITE_Solar Roof",
      energyCarrier: "Solar Roof",
      value: 952.0,
    },
    {
      type: "MODE",
      label: "Air Source Heatpump Mode 1@id=42559",
      name: "MODE_Air Source Heatpump Mode 1@id=42559",
      energyCarrier: "Heat 70-80 °C",
      value: 53.815,
    },
    {
      type: "MODE",
      label: "Gas Boiler Mode 1@id=42557",
      name: "MODE_Gas Boiler Mode 1@id=42557",
      energyCarrier: "Heat 70-80 °C",
      value: 14.253,
    },
    {
      type: "MODE",
      label: "Rooftop PV Mode 1@id=42556",
      name: "MODE_Rooftop PV Mode 1@id=42556",
      energyCarrier: "Electricity",
      value: 142.79999999999998,
    },
    {
      type: "STG_CHG",
      label: "Battery",
      name: "STG_CHG_Battery",
      energyCarrier: "Electricity",
      value: 109163.1187524908,
    },
    {
      type: "STG_DIS",
      label: "Battery",
      name: "STG_DIS_Battery",
      energyCarrier: "Electricity",
      value: 109163.1187524908,
    },
    {
      type: "STG_CHG",
      label: "Generic Hot Water Storage",
      name: "STG_CHG_Generic Hot Water Storage",
      energyCarrier: "Heat 70-80 °C",
      value: 1503.42279729137,
    },
    {
      type: "STG_DIS",
      label: "Generic Hot Water Storage",
      name: "STG_DIS_Generic Hot Water Storage",
      energyCarrier: "Heat 70-80 °C",
      value: 1503.42279729137,
    },
    {
      type: "LINK_IN",
      label: "Electricty",
      name: "LINK_IN_Electricty",
      energyCarrier: "Electricity",
      value: 116.50329850746269,
    },
    {
      type: "LINK_OUT",
      label: "Electricty",
      name: "LINK_OUT_Electricty",
      energyCarrier: "Electricity",
      value: 116.50329850746269,
    },
    {
      type: "LINK_OUT",
      label: "Cooling",
      name: "LINK_OUT_Cooling",
      energyCarrier: "Cooling -10 - 0°C",
      value: 105.0,
    },
    {
      type: "DEMAND",
      label: "Cooling Demand",
      name: "DEMAND_Cooling Demand",
      energyCarrier: "Cooling -10 - 0°C",
      value: null,
    },
    {
      type: "DEMAND",
      label: "Space Heating Demand",
      name: "DEMAND_Space Heating Demand",
      energyCarrier: "Heat 70-80 °C",
      value: null,
    },
    {
      type: "DEMAND",
      label: "Electricity Demand",
      name: "DEMAND_Electricity Demand",
      energyCarrier: "Electricity",
      value: null,
    },
    {
      type: "DEMAND",
      label: "Hot Water Demand",
      name: "DEMAND_Hot Water Demand",
      energyCarrier: "Heat 70-80 °C",
      value: null,
    },
    {
      type: "EC",
      label: "Heat 70-80 °C",
      name: "EC_Heat 70-80 °C",
      energyCarrier: "Heat 70-80 °C",
      value: null,
    },
    {
      type: "EC",
      label: "Gas",
      name: "EC_Gas",
      energyCarrier: "Gas",
      value: null,
    },
    {
      type: "EC",
      label: "Electricity",
      name: "EC_Electricity",
      energyCarrier: "Electricity",
      value: null,
    },
    {
      type: "EC",
      label: "Solar Roof",
      name: "EC_Solar Roof",
      energyCarrier: "Solar Roof",
      value: null,
    },
    {
      type: "EC",
      label: "Cooling -10 - 0°C",
      name: "EC_Cooling -10 - 0°C",
      energyCarrier: "Cooling -10 - 0°C",
      value: null,
    },
  ],
  links: [
    {
      source: "IMP_Gas",
      target: "EC_Gas",
      energyCarrier: "Gas",
      values: [
        7253.895406745949, 11153.160530240753, 8214.367566023464,
        3672.2179259030836, 0.0, 0.0, 0.0, 0.0, 0.0, 1281.6600000000008,
        5553.837499999976, 7264.312499999962, 44393.45142891532,
      ],
    },
    {
      source: "ONSITE_Solar Roof",
      target: "EC_Solar Roof",
      energyCarrier: "Solar Roof",
      values: [
        44529.0, 51414.0, 60624.0, 97201.0, 143283.0, 133489.0, 164662.0,
        161539.0, 104103.0, 62771.0, 39370.0, 38981.0, 1101966.0,
      ],
    },
    {
      source: "EC_Electricity",
      target: "MODE_Air Source Heatpump Mode 1@id=42559",
      energyCarrier: "Electricity",
      values: [
        9572.469545298496, 13044.692266833308, 12146.277691886988,
        11002.412863185507, 8741.219000000101, 7955.202518212441,
        8102.952000000021, 8070.427000000019, 8889.486671604185,
        10240.015500889132, 11042.320000000214, 11313.617000000158,
        120121.09205790932,
      ],
    },
    {
      source: "MODE_Air Source Heatpump Mode 1@id=42559",
      target: "EC_Heat 70-80 °C",
      energyCarrier: "Heat 70-80 °C",
      values: [
        9572.469545298496, 13044.692266833308, 12146.277691886988,
        11002.412863185507, 8741.219000000101, 7955.202518212441,
        8102.952000000021, 8070.427000000019, 8889.486671604185,
        10240.015500889132, 11042.320000000214, 11313.617000000158,
        120121.09205790932,
      ],
    },
    {
      source: "EC_Gas",
      target: "MODE_Gas Boiler Mode 1@id=42557",
      energyCarrier: "Gas",
      values: [
        7253.895406745949, 11153.160530240753, 8214.367566023464,
        3672.2179259030836, 0.0, 0.0, 0.0, 0.0, 0.0, 1281.6600000000008,
        5553.837499999976, 7264.312499999962, 44393.45142891532,
      ],
    },
    {
      source: "MODE_Gas Boiler Mode 1@id=42557",
      target: "EC_Heat 70-80 °C",
      energyCarrier: "Heat 70-80 °C",
      values: [
        5803.116325396775, 8922.52842419263, 6571.4940528187735,
        2937.7743407224775, 0.0, 0.0, 0.0, 0.0, 0.0, 1025.3280000000009,
        4443.07000000001, 5811.4499999999825, 35514.761143131116,
      ],
    },
    {
      source: "EC_Solar Roof",
      target: "MODE_Rooftop PV Mode 1@id=42556",
      energyCarrier: "Solar Roof",
      values: [
        44529.0, 51414.0, 60624.0, 97201.0, 143283.0, 133489.0, 164662.0,
        161539.0, 104103.0, 62771.0, 39370.0, 38981.0, 1101966.0,
      ],
    },
    {
      source: "MODE_Rooftop PV Mode 1@id=42556",
      target: "EC_Electricity",
      energyCarrier: "Electricity",
      values: [
        6679.350000000001, 7712.099999999998, 9093.599999999997,
        14580.149999999981, 21492.449999999957, 20023.349999999966,
        24699.29999999995, 24230.84999999995, 15615.449999999988,
        9415.649999999992, 5905.499999999984, 5847.149999999988,
        165294.9000000011,
      ],
    },
    {
      source: "EC_Electricity",
      target: "STG_CHG_Battery",
      energyCarrier: "Electricity",
      values: [
        7686.116992007161, 8835.394975540792, 11041.878212134376,
        19270.665018843607, 32536.6483577375, 30026.453552496645,
        38789.09768137419, 37782.369904978266, 18390.426771497972,
        10321.195364229077, 5233.292779390877, 5107.305940450134,
        225020.8455506837,
      ],
    },
    {
      source: "STG_DIS_Battery",
      target: "EC_Electricity",
      energyCarrier: "Electricity",
      values: [
        22454.052259611268, 29042.798243127712, 27524.72307531162,
        21354.864337213377, 12494.696511393711, 10667.355857860328,
        9433.568857471202, 9395.892384105473, 12394.217143287837,
        20674.50603121465, 24392.96663586572, 25191.2042143007,
        225020.8455507683,
      ],
    },
    {
      source: "EC_Heat 70-80 °C",
      target: "STG_CHG_Generic Hot Water Storage",
      energyCarrier: "Heat 70-80 °C",
      values: [
        190.5199702968869, 314.73839548753, 644.8386611486674,
        2173.212732887268, 0.0, 19.1215182124269, 0.0, 0.0, 2971.418533973785,
        442.8188243588707, 0.0, 0.0, 6756.668636365458,
      ],
    },
    {
      source: "STG_DIS_Generic Hot Water Storage",
      target: "EC_Heat 70-80 °C",
      energyCarrier: "Heat 70-80 °C",
      values: [
        973.0270996015998, 152.2437044615836, 609.5039164428637,
        1668.0855289789597, 0.0, 18.741, 0.0, 0.0, 2102.074862369618,
        597.1443234699459, 3.6015990190207958e-12, 1.7692514120426495e-11,
        6120.8204353246,
      ],
    },
    {
      source: "LINK_IN_Electricty",
      target: "EC_Electricity",
      energyCarrier: "Electricity",
      values: [
        4089.9908151254376, 4460.8949166605835, 5835.936841033406,
        10506.89792375124, 17282.232477737773, 16114.85401070932,
        20493.05360681925, 19899.028284978536, 9707.24821900333,
        5263.383188587469, 2626.4817793905017, 2566.922940449639,
        118846.92500424672,
      ],
    },
    {
      source: "EC_Electricity",
      target: "LINK_OUT_Electricty",
      energyCarrier: "Electricity",
      values: [
        11275.064537431334, 14896.630917414292, 14563.883012323879,
        11920.17037893571, 6614.949631394106, 5522.003797860771,
        4287.134782916228, 4245.183764105755, 6572.453919194936,
        10425.715354687221, 12154.114635866496, 12543.280214301376,
        115020.58494643412,
      ],
    },
    {
      source: "EC_Cooling -10 - 0°C",
      target: "LINK_OUT_Cooling",
      energyCarrier: "Cooling -10 - 0°C",
      values: [
        3.051999999999999, 0.066, 6.957999999999998, 34.598000000000006,
        710.0069999999995, 1254.3159999999996, 2985.4949999999994,
        2999.0139999999997, 263.78299999999945, 45.52400000000005,
        5.525000000000001, 4.550000000000001, 8312.888000000032,
      ],
    },
    {
      source: "DEMAND_Cooling Demand",
      target: "EC_Cooling -10 - 0°C",
      energyCarrier: "Cooling -10 - 0°C",
      values: [
        3.051999999999999, 0.066, 6.957999999999998, 34.598000000000006,
        710.0069999999995, 1254.3159999999996, 2985.4949999999994,
        2999.0139999999997, 263.78299999999945, 45.52400000000005,
        5.525000000000001, 4.550000000000001, 8312.888000000032,
      ],
    },
    {
      source: "EC_Heat 70-80 °C",
      target: "DEMAND_Space Heating Demand",
      energyCarrier: "Heat 70-80 °C",
      values: [
        6753.644, 13338.129, 9292.148000000017, 4279.380000000002,
        544.4189999999995, 44.37799999999999, 26.867999999999995,
        29.286000000000012, 611.7230000000003, 3782.520000000003,
        7973.049000000003, 9324.335000000003, 55999.879000001136,
      ],
    },
    {
      source: "EC_Electricity",
      target: "DEMAND_Electricity Demand",
      energyCarrier: "Electricity",
      values: [
        4689.7419999999975, 4439.0750000000035, 4702.221000000001,
        4248.663999999992, 3376.561999999998, 3301.8999999999974,
        3446.7380000000003, 3427.7899999999972, 3864.5480000000093,
        4366.612999999996, 4495.220999999989, 4641.07399999999,
        49000.14799999961,
      ],
    },
    {
      source: "EC_Heat 70-80 °C",
      target: "DEMAND_Hot Water Demand",
      energyCarrier: "Heat 70-80 °C",
      values: [
        9404.448999999997, 8466.596999999983, 9390.288999999988,
        9155.680000000004, 8196.8, 7910.444000000004, 8076.08400000001,
        8041.141000000003, 7408.419999999973, 7637.148999999986,
        7512.340999999981, 7800.731999999979, 99000.12600000123,
      ],
    },
  ].map((link) => ({
    ...link,
    value: link.values[11],
    values: null,
  })),
};