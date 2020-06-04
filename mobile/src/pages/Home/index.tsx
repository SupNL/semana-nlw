import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'

interface IBGEUfsResponse {
  sigla : string
}

interface IBGECitiesResponse {
  nome : string
}

const Home = () => {
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNavigationToPoints(){
    navigation.navigate('Points', {
      selectedUf,
      selectedCity
    })
  }

  useEffect(() => {
    axios.get<IBGEUfsResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
    .then(result => {
      const ufInitials = result.data.map(uf => uf.sigla)
      setUfs(ufInitials);
    })
  }, []);

  useEffect(() => {
    if(selectedUf === '')
      return;
    axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(result => {
      const cityNames = result.data.map(city => city.nome)
      setCities(cityNames);
    })
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView style={{ flex : 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
              placeholder={{
                label: "Selecione a UF", 
                value: ""
              }}
              onValueChange={uf => setSelectedUf(uf)}
              style={selectStyles}
              useNativeAndroidPickerStyle={false}
              items={
                ufs.map(uf => ({ label: uf, value: uf }))
              }
          />
          <RNPickerSelect
              placeholder={{
                label: "Selecione a cidade", 
                value: ""
              }}
              onValueChange={city => setSelectedCity(city)}
              style={selectStyles}
              useNativeAndroidPickerStyle={false}
              items={
                cities.map(city => ({ label: city, value: city }))
              }
          />
          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon} >
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;

const selectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid : {
    height: 60,
    backgroundColor: '#FFF',
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 24,
    fontSize: 16,
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#F0F0F5",
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});