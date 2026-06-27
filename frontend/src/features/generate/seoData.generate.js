import { generate_SEO_DataAPI } from "@/api/generate.js";
import { saveVideoDesc_API } from "@/api/project.js";

//function to generate seodata
async function generateSEOData(
  { videoDescription, projectID },
  {
    setToasterData,
    setProjectData,
    setSeoButtonDisable,
    setActiveSEOData,
    currentProjectData,
  },
) {
  setSeoButtonDisable(true);
  saveVideoDesc_API({ description: videoDescription, projectID })
    .then((data) => {
      if (data.success) {
        // setToasterData([
        //   {
        //     status: "success",
        //     info: data.message,
        //     duration: 3000,
        //   },
        // ]);
      } else {
        setToasterData([
          {
            status: "error",
            info: data.message,
            duration: 9000,
          },
        ]);
      }
    })
    .catch((err) => {
      setToasterData([
        {
          status: "error",
          info: err.error.message,
          duration: 9000,
        },
      ]);
    });
  // generatng seo data
  const data = await generate_SEO_DataAPI({ videoDescription, projectID });
  if (!data.success) {
   // console.log(data);

    if (data && data?.error.error.errorCode === "VALIDATION_ERROR") {
      const messages = data.error.error.error
        .map((detail) => detail.msg)
        .join(".\n");
      setToasterData([
        {
          status: "error",
          info: messages,
          duration: 9000,
        },
      ]);
      setSeoButtonDisable(false);
      return;
    }

    setToasterData([
      {
        status: "error",
        info: data.error.message,
        duration: 7000,
      },
    ]);
    setSeoButtonDisable(false);
    return;
  }

  setToasterData([
    {
      status: "success",
      info: "SEO Data Generated successfully!",
      // align: "bottom-right",
    },
  ]);

  const GeneratedData = {
    title: data.data.title,
    description: data.data.description,
    tags: data.data.tags,
    thumbnailDescription: data.data.thumbnailDescription,
  };
  setProjectData((prev) => {
    const findProject = prev.find((data) => {
      if (data.projectID === projectID) return data;
    });
    if (!findProject) {
      const newdata = {
        projectID,
        seoData: [GeneratedData],
      };
      return [...prev, newdata];
    }
    const data = prev.map((data) => {
      if (data.projectID === projectID) {
        // Return a NEW object copy with the updated seoData
        return {
          ...data,
          seoData: [...data.seoData, GeneratedData],
        };
      }
      // Return the original object if it doesn't match
      return data;
    });
    return data;
  });
  setSeoButtonDisable(false);
  //console.log(currentProjectData.length);
  setActiveSEOData(currentProjectData.seoData?.length);
  return GeneratedData;
}
export default generateSEOData;
