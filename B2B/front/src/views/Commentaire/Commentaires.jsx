import { Divider } from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import Profile from "src/assets/images/profile/user.png";
import DashboardCard from "src/components/shared/DashboardCard";

function Commentaires({ data, type }) {
  const [donner, setDonner] = React.useState([]);

  const loading = async () => {
    try {
      setDonner(data.commentaire || []);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    loading();
  }, [data, type]);

  const bottomRef = useRef(null);

  useEffect(() => {
    // Scroll automatique à chaque mise à jour des messages
    if (donner.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [donner]);

  const returnTitle = () => {
    if (type === "projet") {
      return data?.designation;
    } else if (type === "prospect") {
      return data.name;
    } else {
      return "";
    }
  };

  return (
    <div className="div_commentaire">
      {donner && (
        <DashboardCard title={returnTitle()} subtitle={data?.description}>
          {donner.map((index) => {
            return (
              <div key={index._id} className="display_centre">
                <div className="identity">
                  <img src={Profile} alt={index._id} />
                  <div>
                    <p className="name">{index.doby}</p>
                    <p className="temps">{moment(index.createdAt).fromNow()}</p>
                  </div>
                </div>
                <div className="comment">
                  <p className="commentaires">{index.commentaire}</p>
                </div>
                <Divider />
              </div>
            );
          })}
        </DashboardCard>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default Commentaires;
