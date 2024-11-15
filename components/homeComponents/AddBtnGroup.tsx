import { useWindowDimensions, View } from "react-native";
import { Button } from "react-native-paper";
import { styled } from "styled-components/native";

export default function AddBtnGroup() {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 350;

    return (
        <AddBtnGroupView>
            <ButtonContainer>
                <StyledButton
                    mode="contained"
                    textColor="#000000"
                    buttonColor="#38E078"
                    onPress={() => console.log('음식 추가')}
                    smallScreen={isSmallScreen}
                    labelStyle={{
                        fontSize: isSmallScreen ? 14 : 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                    contentStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    음식 추가
                </StyledButton>
            </ButtonContainer>
            <ButtonContainer>
                <StyledButton
                    mode="contained"
                    textColor="#000000"
                    buttonColor="#F5F5F5"
                    onPress={() => console.log('몸무게 입력')}
                    smallScreen={isSmallScreen}
                    labelStyle={{
                        fontSize: isSmallScreen ? 14 : 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                    contentStyle={{
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}
                >
                    몸무게 입력
                </StyledButton>
            </ButtonContainer>
        </AddBtnGroupView>
    );
}

const AddBtnGroupView = styled(View)`
display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    height: 60px;
`;

const ButtonContainer = styled.View`
    flex: 1;
    margin: 0 4px;
`;

interface StyledButtonProps {
    smallScreen: boolean;
}

const StyledButton = styled(Button)<StyledButtonProps>`
    flex: 1;
    height: ${(props) => (props.smallScreen ? '40px' : '50px')};
    border-radius: 24px;
`;