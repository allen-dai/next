import pandas as pd
import numpy as np

df = pd.read_excel("./dataset.xlsx")
df.head()
care_cols =  ['Patient addmited to regular ward (1=yes, 0=no)',\
                'Patient addmited to semi-intensive unit (1=yes, 0=no)',\
                 'Patient addmited to intensive care unit (1=yes, 0=no)']
specialist_features = ['Lymphocytes', 'Neutrophils', 'Sodium', 'Potassium', 'Creatinine','Proteina C reativa mg/dL']

short_labels = ['No care', 'Regular', 'Semi-Intensive', 'Intensive']

cors = 'SARS-Cov-2 exam result'


data = df[care_cols + specialist_features].dropna().to_numpy(copy=True)

print(len(df))
print(len(data))
X = data[:,3:]
Y = data[:,:3]
#with open("./data/dataset", "w") as f:
#    np.savetxt(f, X)
#with open("./data/datalabel", "w") as f:
#    np.savetxt(f, Y)
