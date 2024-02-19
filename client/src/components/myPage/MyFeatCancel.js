// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatCancel(props) {
  const toggleEditing = props.toggleEditing;

  return (
    <div className="myPage-each-feat" onClick={toggleEditing}>
      <FontAwesomeIcon icon={faXmark} />
      <p>취소</p>
    </div>
  );
}
