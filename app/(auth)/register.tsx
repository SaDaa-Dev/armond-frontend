import React from "react";
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import {
    Text,
    TextInput,
    Button,
    Card,
    HelperText,
    RadioButton,
    Icon,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { authApi } from "../../src/api/auth/authApi";
import { useForm, Controller } from "react-hook-form";

// 폼 데이터 타입 정의
type SignUpFormData = {
    name: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    nickName?: string;
    gender: "MALE" | "FEMALE";
    height?: string;
    weight?: string;
    goalCalories?: string;
}; 

export default function Signup() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormData>({
        defaultValues: {
            name: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            nickName: "",
            gender: "MALE",
            height: "",
            weight: "",
            goalCalories: "",
        },
    });

    const password = watch("password");

    // 비밀번호 강도 체크 함수
    const checkPasswordStrength = (password: string) => {
        return {
            hasLetter: /[a-zA-Z]/.test(password),
            
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[@#$%^&+=!]/.test(password),
            isValidLength: password.length >= 8 && password.length <= 20,
        };
    };

    const passwordStrength = checkPasswordStrength(password || "");

    // 전화번호 형식 자동 변환 (000-0000-0000)
    const formatPhoneNumber = (text: string) => {
        // 숫자만 남기고 모든 문자 제거
        const cleaned = text.replace(/\D/g, "");
        let formatted = cleaned;

        // 입력된 번호가 '0'으로 시작하지 않으면 '0'을 추가
        const ensureStartsWithZero = cleaned.startsWith("0") ? cleaned : "0" + cleaned;

        if (ensureStartsWithZero.length > 3 && ensureStartsWithZero.length <= 7) {
            formatted = `${ensureStartsWithZero.slice(0, 3)}-${ensureStartsWithZero.slice(3)}`;
        } else if (ensureStartsWithZero.length > 7) {
            formatted = `${ensureStartsWithZero.slice(0, 3)}-${ensureStartsWithZero.slice(
                3,
                7
            )}-${ensureStartsWithZero.slice(7, 11)}`;
        } else {
            formatted = ensureStartsWithZero;
        }

        return formatted;
    };

    const onSubmit = async (data: SignUpFormData) => {
        setError("");
        setIsLoading(true);

        try {
            // 휴대폰 번호에서 하이픈(-) 제거
            let cleanedPhoneNumber = data.phoneNumber.replace(/-/g, "");
            
            // 전화번호가 0으로 시작하는지 확인, 아니면 0 추가
            if (!cleanedPhoneNumber.startsWith("0")) {
                cleanedPhoneNumber = "0" + cleanedPhoneNumber;
            }
            
            console.log("회원가입 요청 전화번호:", cleanedPhoneNumber);

            const registerResponse = await authApi.register({
                phoneNumber: cleanedPhoneNumber,
                password: data.password,
                name: data.name || undefined,
                nickName: data.nickName || undefined,
                gender: data.gender,
                height: data.height ? parseFloat(data.height) : undefined,
                weight: data.weight ? parseFloat(data.weight) : undefined,
                goalCalories: data.goalCalories
                    ? parseInt(data.goalCalories)
                    : undefined,
            });

            if (registerResponse.status === "SUCCESS") {
                // 회원가입 성공 후 자동 로그인
                const loginResponse = await authApi.login({
                    memberName: cleanedPhoneNumber,
                    password: data.password,
                });

                if (loginResponse.data) {
                    // 토큰 저장
                    await authApi.setTokens(
                        loginResponse.data.accessToken || "",
                        loginResponse.data.refreshToken || ""
                    );

                    // 메인 화면으로 리다이렉트
                    router.replace("/(tabs)");
                } else {
                    setError(loginResponse.error || "로그인에 실패했습니다.");
                }
            } else {
                setError(registerResponse.error || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            setError("회원가입 중 오류가 발생했습니다.");
            console.error("Signup error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>아몬드</Text>
                    <Text style={styles.subtitle}>운동 기록을 더 쉽게</Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Text variant="titleLarge" style={styles.cardTitle}>
                            회원가입
                        </Text>

                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            필수 정보
                        </Text>

                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: "이름을 입력해주세요" }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="이름"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                    error={!!errors.name}
                                />
                            )}
                        />
                        {errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name.message}
                            </HelperText>
                        )}

                        <Controller
                            control={control}
                            name="phoneNumber"
                            rules={{
                                required: "전화번호를 입력해주세요",
                                pattern: {
                                    value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                                    message: "올바른 전화번호 형식이 아닙니다",
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="전화번호"
                                    value={value}
                                    onChangeText={(text) =>
                                        onChange(formatPhoneNumber(text))
                                    }
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                    keyboardType="phone-pad"
                                    placeholder="010-0000-0000"
                                    error={!!errors.phoneNumber}
                                />
                            )}
                        />
                        {errors.phoneNumber && (
                            <HelperText
                                type="error"
                                visible={!!errors.phoneNumber}
                            >
                                {errors.phoneNumber.message}
                            </HelperText>
                        )}

                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: "비밀번호를 입력해주세요",
                                minLength: {
                                    value: 8,
                                    message: "비밀번호는 8자 이상이어야 합니다",
                                },
                                maxLength: {
                                    value: 20,
                                    message: "비밀번호는 20자 이하여야 합니다",
                                },
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
                                    message: "비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다",
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="비밀번호"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    style={styles.input}
                                    mode="outlined"
                                    error={!!errors.password}
                                    placeholder="8-20자, 영문+숫자+특수문자"
                                />
                            )}
                        />
                        {errors.password && (
                            <HelperText
                                type="error"
                                visible={!!errors.password}
                            >
                                {errors.password.message}
                            </HelperText>
                        )}
                        
                        {/* 비밀번호 강도 표시 */}
                        {password && (
                            <View style={styles.passwordStrengthContainer}>
                                <View style={styles.passwordStrengthItem}>
                                    <Icon
                                        source={passwordStrength.hasLetter ? "check-circle" : "circle-outline"}
                                        color={passwordStrength.hasLetter ? "#4CAF50" : "#9E9E9E"}
                                        size={16}
                                    />
                                    <Text style={[
                                        styles.passwordStrengthText,
                                        { color: passwordStrength.hasLetter ? "#4CAF50" : "#9E9E9E" }
                                    ]}>
                                        영문자 포함
                                    </Text>
                                </View>
                                <View style={styles.passwordStrengthItem}>
                                    <Icon
                                        source={passwordStrength.hasNumber ? "check-circle" : "circle-outline"}
                                        color={passwordStrength.hasNumber ? "#4CAF50" : "#9E9E9E"}
                                        size={16}
                                    />
                                    <Text style={[
                                        styles.passwordStrengthText,
                                        { color: passwordStrength.hasNumber ? "#4CAF50" : "#9E9E9E" }
                                    ]}>
                                        숫자 포함
                                    </Text>
                                </View>
                                <View style={styles.passwordStrengthItem}>
                                    <Icon
                                        source={passwordStrength.hasSpecialChar ? "check-circle" : "circle-outline"}
                                        color={passwordStrength.hasSpecialChar ? "#4CAF50" : "#9E9E9E"}
                                        size={16}
                                    />
                                    <Text style={[
                                        styles.passwordStrengthText,
                                        { color: passwordStrength.hasSpecialChar ? "#4CAF50" : "#9E9E9E" }
                                    ]}>
                                        특수문자 포함 (@#$%^&+=!)
                                    </Text>
                                </View>
                                <View style={styles.passwordStrengthItem}>
                                    <Icon
                                        source={passwordStrength.isValidLength ? "check-circle" : "circle-outline"}
                                        color={passwordStrength.isValidLength ? "#4CAF50" : "#9E9E9E"}
                                        size={16}
                                    />
                                    <Text style={[
                                        styles.passwordStrengthText,
                                        { color: passwordStrength.isValidLength ? "#4CAF50" : "#9E9E9E" }
                                    ]}>
                                        8-20자 길이
                                    </Text>
                                </View>
                            </View>
                        )}

                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{
                                required: "비밀번호 확인을 입력해주세요",
                                validate: (value) =>
                                    value === password ||
                                    "비밀번호가 일치하지 않습니다",
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="비밀번호 확인"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    secureTextEntry
                                    style={styles.input}
                                    mode="outlined"
                                    error={!!errors.confirmPassword}
                                />
                            )}
                        />
                        {errors.confirmPassword && (
                            <HelperText
                                type="error"
                                visible={!!errors.confirmPassword}
                            >
                                {errors.confirmPassword.message}
                            </HelperText>
                        )}

                        <Text variant="titleMedium" style={styles.sectionTitle}>
                            추가 정보 (선택)
                        </Text>

                        <Controller
                            control={control}
                            name="nickName"
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="닉네임"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                />
                            )}
                        />

                        <Text style={styles.inputLabel}>성별</Text>
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange, value } }) => (
                                <RadioButton.Group
                                    onValueChange={onChange}
                                    value={value}
                                >
                                    <View style={styles.radioContainer}>
                                        <RadioButton.Item
                                            label="남성"
                                            value="MALE"
                                            style={styles.radioButton}
                                        />
                                        <RadioButton.Item
                                            label="여성"
                                            value="FEMALE"
                                            style={styles.radioButton}
                                        />
                                    </View>
                                </RadioButton.Group>
                            )}
                        />

                        <Controller
                            control={control}
                            name="height"
                            rules={{
                                validate: (value) =>
                                    !value ||
                                    (parseFloat(value) > 0 &&
                                        parseFloat(value) <= 250) ||
                                    "올바른 키를 입력해주세요 (0-250cm)",
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="키 (cm)"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.height}
                                />
                            )}
                        />
                        {errors.height && (
                            <HelperText type="error" visible={!!errors.height}>
                                {errors.height.message}
                            </HelperText>
                        )}

                        <Controller
                            control={control}
                            name="weight"
                            rules={{
                                validate: (value) =>
                                    !value ||
                                    (parseFloat(value) > 0 &&
                                        parseFloat(value) <= 200) ||
                                    "올바른 몸무게를 입력해주세요 (0-200kg)",
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="몸무게 (kg)"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.weight}
                                />
                            )}
                        />
                        {errors.weight && (
                            <HelperText type="error" visible={!!errors.weight}>
                                {errors.weight.message}
                            </HelperText>
                        )}

                        <Controller
                            control={control}
                            name="goalCalories"
                            rules={{
                                validate: (value) =>
                                    !value ||
                                    (!isNaN(parseInt(value)) &&
                                        parseInt(value) > 0) ||
                                    "올바른 칼로리 값을 입력해주세요",
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <TextInput
                                    label="목표 칼로리 (kcal)"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    style={styles.input}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    error={!!errors.goalCalories}
                                />
                            )}
                        />
                        {errors.goalCalories && (
                            <HelperText
                                type="error"
                                visible={!!errors.goalCalories}
                            >
                                {errors.goalCalories.message}
                            </HelperText>
                        )}

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleSubmit(onSubmit)}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.button}
                        >
                            회원가입
                        </Button>

                        <View style={styles.loginContainer}>
                            <Text>이미 계정이 있으신가요?</Text>
                            <Button
                                mode="text"
                                onPress={() =>
                                    router.push("/(auth)/login" as any)
                                }
                                compact
                            >
                                로그인
                            </Button>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        padding: 16,
    },
    header: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.7)",
    },
    card: {
        borderRadius: 12,
        marginBottom: 20,
    },
    cardContent: {
        padding: 8,
    },
    cardTitle: {
        marginBottom: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    sectionTitle: {
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    radioContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    radioButton: {
        flex: 1,
    },
    button: {
        marginTop: 8,
        paddingVertical: 6,
    },
    errorText: {
        color: "red",
        marginBottom: 8,
        textAlign: "center",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
    },
    passwordStrengthContainer: {
        marginTop: 8,
        marginBottom: 16,
        padding: 12,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 8,
    },
    passwordStrengthItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    passwordStrengthText: {
        fontSize: 14,
        marginLeft: 8,
        fontWeight: "500",
    },
});
