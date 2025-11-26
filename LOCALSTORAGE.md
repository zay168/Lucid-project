# Documentation LocalStorage - Lucid App

Ce document décrit la structure des données stockées localement par l'application Lucid dans le LocalStorage du navigateur.

## ⚡ Vue d'ensemble

L'application Lucid utilise **3 clés** dans le LocalStorage :

| Clé | Type | Description |
|-----|------|-------------|
| `lucid_worries_v1` | `Array<Worry>` | Liste de toutes les inquiétudes |
| `lucid_onboarding_completed` | `string` | Status de l'onboarding (`"true"` ou absent) |
| `lucid_user_name` | `string` | Prénom de l'utilisateur |

---

## 📊 Structure détaillée

### 1. `lucid_worries_v1`

Tableau JSON contenant toutes les inquiétudes de l'utilisateur.

#### Structure d'un objet Worry

```typescript
interface Worry {
  id: string;                    // UUID unique
  text: string;                  // Texte de l'inquiétude
  createdAt: number;             // Timestamp de création (ms)
  checkDate: number;             // Timestamp de vérification (ms)
  status: 'pending' | 'happened' | 'did_not_happen';
  category?: Category;           // Catégorie optionnelle
  reframing?: {                  // Recadrage TCC optionnel
    rationalThought?: string;
    actionPlan?: string;
  };
  reflection?: string;           // Réflexion post-résolution
}
```

#### Types auxiliaires

```typescript
type Category = 'work' | 'health' | 'social' | 'finance' | 'other';
```

#### Exemple de données

```json
[
  {
    "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "text": "J'ai peur de rater ma présentation demain",
    "createdAt": 1732582800000,
    "checkDate": 1732669200000,
    "status": "pending",
    "category": "work",
    "reframing": {
      "rationalThought": "Je suis bien préparé et j'ai déjà fait plusieurs présentations avec succès",
      "actionPlan": "Relire mes notes ce soir et respirer profondément avant de commencer"
    }
  },
  {
    "id": "b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
    "text": "Et si je tombe malade avant mon voyage ?",
    "createdAt": 1732496400000,
    "checkDate": 1732928400000,
    "status": "did_not_happen",
    "category": "health",
    "reflection": "Je m'inquiétais pour rien. Le voyage s'est très bien passé !"
  },
  {
    "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
    "text": "J'ai peur que mon ami soit fâché contre moi",
    "createdAt": 1732410000000,
    "checkDate": 1732582800000,
    "status": "happened",
    "category": "social",
    "reflection": "Il était effectivement contrarié, mais nous avons pu en discuter calmement."
  }
]
```

---

### 2. `lucid_onboarding_completed`

Chaîne de caractères simple indiquant si l'onboarding a été complété.

#### Valeurs possibles

```json
"true"   // Onboarding complété
null     // Onboarding non complété (clé absente)
```

#### Exemple

```javascript
localStorage.getItem('lucid_onboarding_completed')
// Retourne: "true" ou null
```

---

### 3. `lucid_user_name`

Chaîne de caractères contenant le prénom de l'utilisateur.

#### Exemple

```json
"Marie"
```

```javascript
localStorage.getItem('lucid_user_name')
// Retourne: "Marie"
```

---

## 🔧 Manipulation des données

### Lecture des worries

```javascript
const saved = localStorage.getItem('lucid_worries_v1');
if (saved) {
  const worries = JSON.parse(saved);
  console.log(worries);
}
```

### Sauvegarde des worries

```javascript
const worries = [
  {
    id: crypto.randomUUID(),
    text: "Ma nouvelle inquiétude",
    createdAt: Date.now(),
    checkDate: Date.now() + 86400000, // +24h
    status: "pending",
    category: "other"
  }
];

localStorage.setItem('lucid_worries_v1', JSON.stringify(worries));
```

### Mise à jour du nom d'utilisateur

```javascript
localStorage.setItem('lucid_user_name', 'Sophie');
```

### Marquer l'onboarding comme complété

```javascript
localStorage.setItem('lucid_onboarding_completed', 'true');
```

---

## 🗑️ Suppression des données

### Réinitialisation complète

```javascript
localStorage.removeItem('lucid_worries_v1');
localStorage.removeItem('lucid_onboarding_completed');
localStorage.removeItem('lucid_user_name');
```

### Suppression d'une inquiétude spécifique

```javascript
const saved = localStorage.getItem('lucid_worries_v1');
if (saved) {
  let worries = JSON.parse(saved);
  worries = worries.filter(w => w.id !== 'id-to-delete');
  localStorage.setItem('lucid_worries_v1', JSON.stringify(worries));
}
```

---

## 📈 Statistiques calculables

À partir des données `lucid_worries_v1`, vous pouvez calculer :

### Taux de lucidité

```javascript
const resolved = worries.filter(w => w.status !== 'pending');
const avoided = resolved.filter(w => w.status === 'did_not_happen');
const rate = Math.round((avoided.length / resolved.length) * 100);
```

### Statistiques par catégorie

```javascript
const byCategory = worries.reduce((acc, worry) => {
  const cat = worry.category || 'other';
  acc[cat] = (acc[cat] || 0) + 1;
  return acc;
}, {});
```

### Inquiétudes en attente de vérification

```javascript
const now = Date.now();
const dueWorries = worries.filter(w => 
  w.status === 'pending' && w.checkDate <= now
);
```

---

## 🔒 Confidentialité

⚠️ **Important** : Toutes les données sont stockées **localement** dans le navigateur de l'utilisateur.

- Aucune donnée n'est envoyée à un serveur
- Les données persistent tant que l'utilisateur ne vide pas son LocalStorage
- Les données sont accessibles uniquement depuis le même navigateur et domaine
- Utiliser `localStorage.clear()` supprimera TOUTES les données de l'application

---

## 🔄 Import/Export

L'application propose des fonctionnalités d'export et d'import au format JSON pour sauvegarder les données.

### Format d'export

```json
[
  {
    "id": "...",
    "text": "...",
    "createdAt": 1732582800000,
    "checkDate": 1732669200000,
    "status": "pending",
    "category": "work",
    "reframing": {
      "rationalThought": "...",
      "actionPlan": "..."
    },
    "reflection": "..."
  }
]
```

Ce fichier peut être sauvegardé localement et réimporté ultérieurement.

---

## 📝 Notes de version

- **v1.0.0** : Structure initiale avec support des catégories, recadrage TCC, et réflexions
- Clé `lucid_worries_v1` : Le suffixe `_v1` permet de gérer de futures migrations de données si nécessaire

---

**Dernière mise à jour** : 26 novembre 2025
