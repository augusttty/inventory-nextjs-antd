import { Button, Form, Image, Input, Table, Tooltip, message } from "antd";
import React, { useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { SetLoading } from "@/redux/loadersSlice";
import axios from "axios";

function OneGraph() {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [queryCode, setQueryCode] = useState("");

  const handleSubmit = async (code: string) => {
    try {
      dispatch(SetLoading(true));
      setQueryCode(code);
      const encodedCode = encodeURIComponent(code);
      const response = await axios.get(
        `api/products/check?code=${encodedCode}`
      );

      const url = response.data?.data?.productImage;
      setImageUrl(url);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const [addUnits, setAddUnits] = useState(false);

  const onHideUnits = () => {
    setAddUnits(false);
    setImageUrl("");
    // onHide()
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event.currentTarget.value);
    }
  };

  const onFinish = async () => {
    try {
      dispatch(SetLoading(true));
      console.log("OneGraph.tsx onFinish", queryCode);
      const response = await axios.get(
        `/api/products/queryOne?popCode=${queryCode}`
      );
      console.log(response);
      if (response.status === 201) {
        setTableData([
          { label: "Units Remaining", value: response.data.unitsRemaining },
          { label: "Units sold", value: response.data.unitsSold },
          { label: "Average buy price", value: response.data.averageBuyPrice },
          {
            label: "Average sell price",
            value: response.data.averageSellPrice,
          },
          { label: "Profit", value: response.data.profit },
          {
            label: "Average Money in tax",
            value: response.data.averageMoneyInTax,
          },
        ]);
        message.success(response.data.message);
      } else {
        message.error(response.data.message || "Something Went Wrong!");
      }
      setAddUnits(true);
    } catch (error: any) {
      // console.log(error)
      message.error("Something went wrong");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Field",
      dataIndex: "label",
      key: "field",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div>
      <Form layout="vertical">
        <div className="flex w-auto justify-center">
          <Form.Item label="Product Code" name="code" className="w-auto">
            <Input
              placeholder="#A0005"
              onPressEnter={handleEnterPress}
              suffix={
                <Tooltip title="Press Enter Key after entering...">
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </Form.Item>
        </div>
        <div className="flex justify-center ">
          <div>
            {/* {imageUrl && <BuyingUnits imageUrl={imageUrl} onHide={onHideBuyingUnits} />} */}
            {imageUrl && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <p>Is this product?</p>
                  <Image src={imageUrl} alt="Product Image" />
                </div>
                <div className="flex flex-row items-center">
                  <Button
                    type="primary"
                    style={{ margin: "10px" }}
                    onClick={onFinish}
                  >
                    Yes
                  </Button>
                  <Button
                    type="default"
                    style={{ margin: "10px" }}
                    onClick={onHideUnits}
                  >
                    No
                  </Button>
                </div>

                <div className="flex flex-row items-center">
                  {addUnits && (
                    <div className="my-3">
                      <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}

export default OneGraph;
