import { IComment } from "@/app/interface/TClient";
import moment from "moment";

type Props = {
  comment: IComment[];
};

function Commentaire({ comment }: Props) {
  return (
    <div>
      {comment.length > 0 ? (
        <div>
          {comment.map((index) => {
            return (
              <div key={index._id}>
                <p>
                  <span className="font-bold">{index.sendby} : </span>
                  <span className="text-base"> {index.commentaire}</span>

                  <span className="ml-5 text-xs">
                    {moment(index.createdAt).fromNow()}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No comment found</p>
      )}
    </div>
  );
}

export default Commentaire;
