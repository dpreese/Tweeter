import { User } from "tweeter-shared/src";
import { useNavigateToUser } from "../userInfo/UserInfoHooks";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { aliasLinkProps } = useNavigateToUser(props.featurePath);

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
