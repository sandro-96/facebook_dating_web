import "./index.scss"
import Man01 from "../../assets/avatar/man_01.png"
import Man02 from "../../assets/avatar/man_02.png"
import Man03 from "../../assets/avatar/man_03.png"
import Man04 from "../../assets/avatar/man_04.png"
import Man05 from "../../assets/avatar/man_05.png"
import Man06 from "../../assets/avatar/man_06.png"
import Woman01 from "../../assets/avatar/woman_01.png"
import Woman02 from "../../assets/avatar/woman_02.png"
import Woman03 from "../../assets/avatar/woman_03.png"
import Woman04 from "../../assets/avatar/woman_04.png"
import Woman05 from "../../assets/avatar/woman_05.png"
import Woman06 from "../../assets/avatar/woman_06.png"
import Other01 from "../../assets/avatar/other_01.png"
import Other02 from "../../assets/avatar/other_02.png"
import Other03 from "../../assets/avatar/other_03.png"
import Other04 from "../../assets/avatar/other_04.png"
import Other05 from "../../assets/avatar/other_05.png"
import Other06 from "../../assets/avatar/other_06.png"
import Other07 from "../../assets/avatar/other_07.png"

export const Avatar = ({imgKey, genderKey, sizeKey = 56}) => {
    const getAvatar = () => {
        switch (imgKey) {
            case 'man_01': return Man01;
            case 'man_02': return Man02;
            case 'man_03': return Man03;
            case 'man_04': return Man04;
            case 'man_05': return Man05;
            case 'man_06': return Man06;
            case 'woman_01': return Woman01;
            case 'woman_02': return Woman02;
            case 'woman_03': return Woman03;
            case 'woman_04': return Woman04;
            case 'woman_05': return Woman05;
            case 'woman_06': return Woman06;
            case 'other_01': return Other01;
            case 'other_02': return Other02;
            case 'other_03': return Other03;
            case 'other_04': return Other04;
            case 'other_05': return Other05;
            case 'other_06': return Other06;
            case 'other_07': return Other06;
            default: return genderKey === 'male' ? Man01 : genderKey === 'female' ? Woman01 : Other01 ;
        }
    }
    return (<img src={getAvatar()} alt={imgKey} width={sizeKey} height={sizeKey}/>)
}
Avatar.propTypes = {};

export default Avatar;