import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  // "알음이의 첫번째 게시글 #해시태그 #익스프레스"
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((v) => {
        if (v.match(/(#[^\s#]+)/)) {
          // #을 때기 위해 slice(1)
          return (
            <Link href={`/hashtag/${v.slice(1)}`} key={v} legacyBehavior>
              {v}
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
