import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import axios from 'axios';

import { RNS3 } from 'react-native-aws3';
import uuidV4 from 'uuid/v4';

export default class PickingImage extends React.Component {

  state = {
    avatarSource: { uri: this.props.avatarUrl, isStatic: true }
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source;

        // You can display the image using either:
        //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};z
          let path = response.uri;
          this.props.updateAvatarUrl(path);
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};

          let path = response.uri.replace('file://', '');

          let file = {
              uri: path,
              name: uuidV4(),
              type: "image/png"
          }

          console.log("file: ", file);

          let options = {
              keyPrefix: "uploads/",
              bucket: "purdue-pixell",
              region: "us-east-1",
              accessKey: "ACCESS_KEY",
              secretKey: "SECRET_KEY",
              successActionStatus: 201
          }

          RNS3.put(file, options).then(response => {
              console.log(response);
              if (response.status !== 201)
                  throw new Error("Failed to upload image to S3");

              console.log(response);
              console.log(response.body);

              let avatarUrl = response.body.postResponse.location;

              this.props.updateAvatarUrl(avatarUrl);

          });
        }

        this.setState({
          avatarSource: source
        });
      }
    });
  }



  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
