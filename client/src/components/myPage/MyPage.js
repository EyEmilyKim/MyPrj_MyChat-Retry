import useStateLogger from '../../hooks/useStateLogger';
import './MyPage.css';
import useToggleState from '../../hooks/useToggleState';
import MyMainNormal from './MyMainNormal';
import MyMainEditing from './MyMainEditing';

export default function MyPage() {
  const [isEditing, toggleEditing] = useToggleState(false);
  // useStateLogger(isEditing, 'isEditing');

  return (
    <div className="myPage-body">
      <h1 className="myPage-title">MyApp-test MyPage</h1>

      <div className="myPage-main">
        {!isEditing ? (
          <MyMainNormal toggleEditing={toggleEditing} />
        ) : (
          <MyMainEditing toggleEditing={toggleEditing} />
        )}
      </div>
    </div>
  );
}
