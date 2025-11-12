// import { Status, User } from "tweeter-shared/src";
import Post from "./Post";
import { useNavigateToUser } from "../userInfo/UserInfoHooks";
import { User, Status } from "tweeter-shared";

interface Props {
  user: User;
  featurePath: string;
  formattedDate: string;
  Status: Status;
}

const StatusItem = (props: Props) => {
  const { aliasLinkProps } = useNavigateToUser("/story");

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <a {...aliasLinkProps(props.user.alias)}>
                {props.user.alias}
              </a>
            </h2>
            {props.formattedDate}
            <br />
            <Post status={props.Status} featurePath={props.featurePath} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
