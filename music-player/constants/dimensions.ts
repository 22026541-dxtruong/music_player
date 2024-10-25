import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const dimensions = {
    windowWidth: width,
    windowHeight: height,
    padding: 10,
    margin: 10,
};

export default dimensions;
