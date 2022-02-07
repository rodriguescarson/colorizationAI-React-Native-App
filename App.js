import React, { Component } from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';
import ProgressBar from 'react-native-progress/Bar'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import axios from 'axios'
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: true,
      dataSource: null,
      loading: true,
      base64: null
    }
  }
  selectGalleryImage() {
    const options = {
      includeBase64: true
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) { console.log('User Cancelled') }
      else if (response.error) {
        console.log('Image Picker Error')
      } else if (response.customButton) {
        console.log('User pressed custom button')
      } else {

        this.setState({ base64: response.base64 })
        this.goForAxios()
      }
    })
  }
  goBack() {
    this.setState({
      menu: true,
      dataSource: null,
      loading: true,
      base64: null
    })
  }
  goForAxios() {
    const { base64 } = this.state
    this.setState({ menu: false })

    axios.request({
      method: 'POST',
      url: 'https://ai-picture-colorizer.p.rapidapi.com/colorize-picture',
      headers: {
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001',
        'x-rapidapi-host': 'ai-picture-colorizer.p.rapidapi.com',
        'x-rapidapi-key': 'AnaAO5F8DtV86KC8d7D3vANFwCjLlyHA'
      },
      data: {
        imageBase64: base64,
        render_factor: '20'
      }
    }).then((response) => {
      console.log('successbw')
      this.setState({
        loading: false,
        dataSource: response.data.imageBase64
      })
    }).catch(function (error) {
      console.error(error);
    });
  }
  render() {
    const { loading, base64, dataSource, menu } = this.state
    return (
      menu ? (
        <LinearGradient
          colors={['#ff70b8', '#a061fe']}
          style={styles.linerarGradient
          } >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Image Colorization</Text>
            <Text style={styles.subtitle}>Color black and white images</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('./assets/old-video-camera.png')}
              style={styles.cameraImage}
            ></Image>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this.selectGalleryImage.bind(this)}
              buttonStyle={styles.button}
              title="Select Image"
              titleStyle={{ fontSize: 20 }}
            ></Button>
          </View>

        </LinearGradient >
      ) : (<LinearGradient style={styles.outputContainer} colors={['#ff70b8', '#a061fe']}>
        <Button title="Go to Menu" onPress={this.goBack.bind(this)} buttonStyle={styles.button}></Button>
        {base64 ? <Image style={styles.images}
          source={{ uri: `data:image/png;base64,${base64}` }}></Image>
          : <ProgressBar indeterminate={true}></ProgressBar>
        }{
          loading ? <ProgressBar indeterminate={true}></ProgressBar> :
            <Image style={styles.images}
              source={{ uri: `data:image/png;base64,${dataSource}` }}></Image>
        }
      </LinearGradient>))
  }
}

const styles = StyleSheet.create({
  linerarGradient: {
    flex: 1,
  },
  button: {
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  titleContainer: {
    marginTop: 70,
    marginLeft: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 50
  },
  inputContainer: {
    marginHorizontal: 10,
    marginTop: 90
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120
  },
  cameraImage: {
    width: 270,
    height: 270,
  },
  output: {
    fontSize: 29,
    alignItems: 'center'
  }, outputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  images: {
    width: 250,
    height: 20,
    margin: 10,
    resizeMode: 'contain'
  }
})