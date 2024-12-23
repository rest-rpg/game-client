import * as Yup from "yup";
import {
  CharacterClass,
  CharacterRace,
  CharacterSex,
} from "../../generated-sources/openapi";

export const races = Object.values(CharacterRace);
export const sexes = Object.values(CharacterSex);
export const classes = Object.values(CharacterClass);
export const characterCreateMaxSkillpoints = 50;

export const CharacterCreateSchema = Yup.object().shape({
  name: Yup.string().required("REQUIRED"),
  race: Yup.string().oneOf(races, "WRONG_RACE").required("REQUIRED"),
  sex: Yup.string().oneOf(sexes, "WRONG_SEX").required("REQUIRED"),
  characterClass: Yup.string()
    .oneOf(classes, "WRONG_CLASS")
    .required("REQUIRED"),
  artwork: Yup.string(),
  statistics: Yup.object({
    strength: Yup.number().min(0).required("REQUIRED"),
    dexterity: Yup.number().min(0).required("REQUIRED"),
    constitution: Yup.number().min(0).required("REQUIRED"),
    intelligence: Yup.number().min(0).required("REQUIRED"),
  }).test("has-enough-skillpoints", "NOT_ENOUGH_SKILLPOINTS", function (value) {
    const isInvalid =
      value.strength +
        value.dexterity +
        value.constitution +
        value.intelligence >
      characterCreateMaxSkillpoints;

    if (!isInvalid) return true;
    return this.createError({
      path: "statistics.freePoints",
      message: "NOT_ENOUGH_SKILLPOINTS",
    });
  }),
});
