import './MyPage.css';
import MyProfile from './MyProfile';
import MyFeatEdit from './MyFeatEdit';
import MyFeatSetting from './MyFeatSetting';

export default function MyPage() {
  return (
    <div className="myPage-body">
      <h1 className="myPage-title">MyApp-test MyPage</h1>

      <div className="myPage-main">
        <MyProfile />

        <div className="myPage-feats">
          <MyFeatEdit />
          <MyFeatSetting />
        </div>
      </div>
    </div>
  );
}
