import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFresponse {
  sigla: string;
}

interface IBGECityresponse {
  nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    useEffect(() => {
      axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUfs(ufInitials);
      });

    }, []);

    useEffect(() => {
      if(selectedUF === '0'){
          return;
      }
      axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
          const cityNames = response.data.map(city => city.nome);
          setCities(cityNames);
      });
    }, [selectedUF]);

    function handleNavigateToPoints() {
      const uf = selectedUF;
      const city = selectedCity;
        navigation.navigate('Points', {
          uf,
          city
        })
    }

    function handleSelectUF(value: string){
      const uf = value;

      setSelectedUF(uf)
    }

    function handleSelectCity(value: string){
      const city = value;

      setSelectedCity(city)
    }

    return (
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }} 
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>

                <View style={styles.containerSelectors}>
                  <RNPickerSelect
                      onValueChange={(value) => handleSelectUF(value)}
                      items={
                        ufs.map(uf => (
                          { label: uf, value: uf }
                        ))
                      }
                    />
                </View>

                <View style={styles.containerSelectors}>
                  <RNPickerSelect
                    onValueChange={(value) => handleSelectCity(value)}
                    items={
                      cities.map(city => (
                        { label: city, value: city }
                      ))
                    }
                  />
                </View>

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Icon name="arrow-right" color="#FFF" size={24} />
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      backgroundColor: 'rgba(0, 0, 0, 0)',
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
    },

    containerSelectors: {
      paddingHorizontal: 10,
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
      borderRadius: 8,
      marginTop: 8,
      backgroundColor: '#FFF'
    },

  });

export default Home;