import { Status, Type} from "tweeter-shared/src";
import { useNavigateToUser } from "../userInfo/UserInfoHooks";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { aliasLinkProps } = useNavigateToUser(props.featurePath);

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <a key={index} {...aliasLinkProps(segment.text)}>
            {segment.text}
          </a>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
};

export default Post;
