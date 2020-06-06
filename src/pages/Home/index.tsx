import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons/";
import { StyleSheet, View, Text, ImageBackground, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  id: number;
  nome: string;
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface ItemSelect {
  label: string;
  value: string;
}

const Home = () => {
  const navigation = useNavigation();
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [ufs, setUfs] = useState<ItemSelect[]>([]);
  const [cities, setCities] = useState<ItemSelect[]>([]);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf: IBGEUFResponse) => {
          return { label: uf.sigla, value: uf.sigla };
        });

        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city: IBGECityResponse) => {
          return { label: city.nome, value: city.nome };
        });

        setCities(cityNames);
      });
  }, [selectedUf]);

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View>
        <RNPickerSelect
          placeholder={{
            label: "Selecione uma UF",
          }}
          style={{
            ...pickerStyle,
            inputAndroidContainer: {
              borderRadius: 10,
            }
          }}
          Icon={() => {
            return <Icon name="chevron-down" size={1.5} color="gray" />;
          }}
          onValueChange={(value) => setSelectedUf(value)}
          items={ufs}
        />
        <RNPickerSelect
          placeholder={{
            label: "Selecione uma cidade",
          }}
          style={{ ...pickerStyle }}
          onValueChange={(value) => setSelectedCity(value)}
          Icon={() => {
            return <Icon name="chevron-down" size={1.5} color="gray" />;
          }}
          items={cities}
        />
        <RectButton
          style={styles.button}
          onPress={() => navigation.navigate("Points", { uf: selectedUf, city: selectedCity})}
        >
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

export default Home;
