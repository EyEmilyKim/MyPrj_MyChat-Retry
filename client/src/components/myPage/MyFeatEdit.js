// CSS definition is in MyPage.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function MyFeatEdit(props) {
  const toggleEditing = props.toggleEditing;

  return (
    <div className="myPage-each-feat" onClick={toggleEditing}>
      <FontAwesomeIcon icon={faPen} />
      <p>수정</p>
    </div>
  );
}
