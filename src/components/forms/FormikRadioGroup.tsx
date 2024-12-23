import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import React from "react";

type Props = {
  error?: string;
  touched?: boolean;
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  radioValues: string[];
  inputName: string;
  translationKey: string;
  isRequired?: boolean;
};

const FormikRadioGroup = ({
  error,
  touched,
  value,
  handleChange,
  radioValues,
  inputName,
  translationKey,
  isRequired = true,
}: Props) => {
  const { t } = useTranslation();

  return (
    <FormControl
      id={inputName}
      mb={6}
      isInvalid={error != null && touched}
      isRequired={isRequired}
    >
      <FormLabel>{t(`${translationKey}.NAME`)}</FormLabel>
      <RadioGroup value={value}>
        <Wrap spacing="30px">
          {!isRequired && (
            <WrapItem>
              <Radio onChange={handleChange} name={inputName} value={""}>
                {t("INPUT.NONE")}
              </Radio>
            </WrapItem>
          )}
          {radioValues.map((val) => (
            <WrapItem key={val}>
              <Radio onChange={handleChange} name={inputName} value={val}>
                {t(`${translationKey}.${val}`)}
              </Radio>
            </WrapItem>
          ))}
        </Wrap>
      </RadioGroup>
      <FormErrorMessage>{error && t(`VALIDATION.${error}`)}</FormErrorMessage>
    </FormControl>
  );
};

export default FormikRadioGroup;
