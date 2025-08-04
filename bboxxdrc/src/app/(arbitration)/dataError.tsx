import Tableau from "../Tools/Tableau";

interface DataPush {
  id: string;
  customer_id: string;
  data: {
    feedback: string;
    currentFeedback: string | boolean;
  };
}
type Props = {
  data: DataPush[];
};

function DataError({ data }: Props) {
  const keyColonnes = [{ title: "Customer ID", accessorKey: "customer_id" }];
  return (
    <div>
      {data.length + " feedbacks are not correct"}
      <Tableau
        data={data}
        keyColonnes={keyColonnes}
        search_placeholder="Customer ID"
        customer_id="customer_id"
      />
    </div>
  );
}

export default DataError;
