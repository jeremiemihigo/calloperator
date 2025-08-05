import { IUploadClient } from "@/app/interface/IOther";
import Tableau from "@/app/Tools/Tableau";

type Props = {
  data: IUploadClient[];
};
function TableauCustomerTrack({ data }: Props) {
  const keycolonnes = [
    { accessorKey: "customer_id", title: "customer_id" },
    { accessorKey: "customer_name", title: "customer_name" },
    { accessorKey: "shop", title: "Shop" },
    { accessorKey: "region", title: "Region" },
    { accessorKey: "sat", title: "Sat" },
    { accessorKey: "par", title: "Par" },
    { accessorKey: "cashattendu", title: "Cash attendu" },
    {
      accessorKey: "cashPayer",
      title: "Cash Payer",
    },
  ];
  return (
    <div>
      {data.length > 0 && (
        <Tableau
          data={data}
          keyColonnes={keycolonnes}
          search_placeholder="account_id"
          customer_id="account_id"
        />
      )}
    </div>
  );
}

export default TableauCustomerTrack;
